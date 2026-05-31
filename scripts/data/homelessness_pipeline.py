#!/usr/bin/env python3
"""Command entry point for the homelessness data pipeline."""

from __future__ import annotations

import argparse
import importlib
import importlib.util
import json
import platform
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from importlib import metadata
from pathlib import Path
from typing import NamedTuple
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


MINIMUM_PYTHON = (3, 11)
PROJECT_ROOT = Path(__file__).resolve().parents[2]
HOMELESSNESS_DATA_DIR = PROJECT_ROOT / "data" / "homelessness"
RAW_DATA_DIR = HOMELESSNESS_DATA_DIR / "raw"
SOURCE_MANIFEST_PATH = RAW_DATA_DIR / "manifest.json"

HUD_USER_ROOT = "https://www.huduser.gov"
AHAR_INDEX_URL = f"{HUD_USER_ROOT}/portal/datasets/ahar.html"
AHAR_UPDATE_SCHEDULE_URL = f"{HUD_USER_ROOT}/portal/datasets/update-schedule.html"
FALLBACK_RELEASE_YEAR = 2024
FALLBACK_AHAR_RESOURCE_PAGE_URL = (
    f"{HUD_USER_ROOT}/portal/datasets/ahar/"
    "2024-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html"
)
HUD_COC_FEATURE_SERVICE_URL = (
    "https://services.arcgis.com/VTyQ9soqVukalItT/ArcGIS/rest/services/"
    "CoC_Geo_Type/FeatureServer/0"
)
HUD_COC_GEOJSON_URL = (
    f"{HUD_COC_FEATURE_SERVICE_URL}/query?"
    "where=1%3D1&outFields=*&returnGeometry=true&f=geojson"
)
USER_AGENT = (
    "a-beautiful-point-data-discovery/0.1 "
    "(source manifest generation; https://abeautifulpoint.com)"
)

FALLBACK_RESOURCE_LINKS = (
    {
        "text": "2024 AHAR Report: Part 1 - PIT Estimates of Homelessness",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/pdf/2024-AHAR-Part-1.pdf",
    },
    {
        "text": "2007 - 2024 Point-in-Time Estimates by CoC",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2007-2024-PIT-Counts-by-CoC.xlsb",
    },
    {
        "text": "2007 - 2024 Point-in-Time Estimates by State",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2007-2024-PIT-Counts-by-State.xlsb",
    },
    {
        "text": "2007 - 2024 Housing Inventory Count by CoC",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2007-2024-HIC-Counts-by-CoC.xlsx",
    },
    {
        "text": "2007 - 2024 Housing Inventory Count by State",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2007-2024-HIC-Counts-by-State.xlsx",
    },
    {
        "text": "2011 - 2024 PIT Veteran Counts by CoC",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2011-2024-PIT-Veteran-Counts-by-CoC.xlsx",
    },
    {
        "text": "2011 - 2024 PIT Veteran Counts by State",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2011-2024-PIT-Veteran-Counts-by-State.xlsx",
    },
    {
        "text": "2024 Housing Inventory Count (Raw File)",
        "href": f"{HUD_USER_ROOT}/portal/sites/default/files/xls/2024-HIC-Counts-by-State.csv",
    },
)


class RequiredDistribution(NamedTuple):
    distribution_name: str
    import_name: str
    expected_version: str
    reason: str


REQUIRED_DISTRIBUTIONS = (
    RequiredDistribution(
        "pandas",
        "pandas",
        "2.2.3",
        "canonical table shaping and validation",
    ),
    RequiredDistribution(
        "python-calamine",
        "python_calamine",
        "0.6.2",
        "HUD XLSB/XLSX workbook parsing through pandas",
    ),
    RequiredDistribution(
        "openpyxl",
        "openpyxl",
        "3.1.5",
        "fallback XLSX workbook parsing",
    ),
)


@dataclass(frozen=True)
class FetchResult:
    url: str
    status: int | None
    content_type: str | None
    byte_count: int
    body: str
    error: str | None
    waf_action: str | None
    cf_mitigated: str | None

    @property
    def usable(self) -> bool:
        return (
            self.status == 200
            and self.byte_count > 0
            and not self.error
            and not self.waf_action
            and not self.cf_mitigated
            and bool(self.body.strip())
        )

    def to_log(self) -> dict[str, object]:
        return {
            "url": self.url,
            "status": self.status,
            "content_type": self.content_type,
            "byte_count": self.byte_count,
            "error": self.error,
            "waf_action": self.waf_action,
            "cf_mitigated": self.cf_mitigated,
            "usable": self.usable,
        }


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self._current_href: str | None = None
        self._current_text: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        if tag.lower() != "a":
            return
        attr_map = {name.lower(): value for name, value in attrs}
        href = attr_map.get("href")
        if not href:
            return
        self._current_href = href
        self._current_text = []

    def handle_data(self, data: str) -> None:
        if self._current_href:
            self._current_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() != "a" or not self._current_href:
            return
        text = normalize_space(" ".join(self._current_text))
        if text:
            self.links.append({"href": self._current_href, "text": text})
        self._current_href = None
        self._current_text = []


class TextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)

    @property
    def text(self) -> str:
        return normalize_space(" ".join(self.parts))


def distribution_version(name: str) -> str | None:
    try:
        return metadata.version(name)
    except metadata.PackageNotFoundError:
        return None


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value)).strip()


def parse_links(html: str, base_url: str) -> list[dict[str, str]]:
    parser = LinkParser()
    parser.feed(html)
    links: list[dict[str, str]] = []
    for link in parser.links:
        links.append(
            {
                "href": urljoin(base_url, link["href"]),
                "text": link["text"],
            }
        )
    return links


def html_to_text(html: str) -> str:
    parser = TextParser()
    parser.feed(html)
    return parser.text


def fetch_text(
    url: str,
    *,
    accept: str = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    timeout: int = 30,
) -> FetchResult:
    request = Request(
        url,
        headers={
            "Accept": accept,
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urlopen(request, timeout=timeout) as response:
            raw = response.read()
            encoding = response.headers.get_content_charset() or "utf-8"
            return FetchResult(
                url=url,
                status=response.status,
                content_type=response.headers.get("content-type"),
                byte_count=len(raw),
                body=raw.decode(encoding, errors="replace"),
                error=None,
                waf_action=response.headers.get("x-amzn-waf-action"),
                cf_mitigated=response.headers.get("cf-mitigated"),
            )
    except HTTPError as error:
        raw = error.read()
        encoding = error.headers.get_content_charset() or "utf-8"
        return FetchResult(
            url=url,
            status=error.code,
            content_type=error.headers.get("content-type"),
            byte_count=len(raw),
            body=raw.decode(encoding, errors="replace"),
            error=str(error),
            waf_action=error.headers.get("x-amzn-waf-action"),
            cf_mitigated=error.headers.get("cf-mitigated"),
        )
    except (TimeoutError, URLError) as error:
        return FetchResult(
            url=url,
            status=None,
            content_type=None,
            byte_count=0,
            body="",
            error=str(error),
            waf_action=None,
            cf_mitigated=None,
        )


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return slug.strip("-")


def extension_for_url(url: str) -> str:
    suffix = Path(urlparse(url).path).suffix.lower()
    return suffix.removeprefix(".")


def file_name_for_url(url: str) -> str:
    return Path(urlparse(url).path).name


def year_range_for_source(text: str, file_name: str) -> tuple[int | None, int | None]:
    match = re.search(r"(20\d{2})\s*[-–]\s*(20\d{2})", f"{text} {file_name}")
    if match:
        return int(match.group(1)), int(match.group(2))

    single_year_match = re.search(r"\b(20\d{2})\b", f"{text} {file_name}")
    if single_year_match:
        year = int(single_year_match.group(1))
        return year, year

    return None, None


def classify_resource(text: str, file_name: str) -> tuple[str, str | None, bool]:
    value = f"{text} {file_name}".lower()
    if file_name.lower().endswith(".pdf"):
        return "report", None, False
    if "pit-veteran" in value or "veteran" in value:
        dataset_kind = "pit_veteran"
    elif "pit" in value or "point-in-time" in value:
        dataset_kind = "pit"
    elif "hic" in value or "housing inventory" in value:
        dataset_kind = "hic"
    else:
        dataset_kind = "unknown"

    if "coc" in value:
        geography_level = "coc"
    elif "state" in value:
        geography_level = "state"
    else:
        geography_level = None

    required_for_mvp = dataset_kind == "pit" and geography_level in {"coc", "state"}
    return dataset_kind, geography_level, required_for_mvp


def source_record_from_link(
    link: dict[str, str],
    *,
    release_year: int,
    source_page_url: str,
    published_date: str | None,
) -> dict[str, object]:
    source_url = link["href"]
    source_name = normalize_space(link["text"])
    file_name = file_name_for_url(source_url)
    year_start, year_end = year_range_for_source(source_name, file_name)
    dataset_kind, geography_level, required_for_mvp = classify_resource(
        source_name,
        file_name,
    )

    return {
        "source_id": f"hud-ahar-{release_year}-{slugify(Path(file_name).stem)}",
        "source_name": source_name,
        "source_url": source_url,
        "source_page_url": source_page_url,
        "publisher": "U.S. Department of Housing and Urban Development",
        "published_date": published_date,
        "release_year": release_year,
        "year_start": year_start,
        "year_end": year_end,
        "dataset_kind": dataset_kind,
        "geography_level": geography_level,
        "file_name": file_name,
        "file_extension": extension_for_url(source_url),
        "file_hash": None,
        "file_size_bytes": None,
        "retrieved_at": None,
        "license_or_usage_note": "HUD USER public resource link on an official .gov source page.",
        "required_for_mvp": required_for_mvp,
    }


def discover_latest_resource_page(
    fetch_log: list[dict[str, object]],
    warnings: list[str],
) -> tuple[int, str]:
    result = fetch_text(AHAR_INDEX_URL)
    fetch_log.append(result.to_log())
    if not result.usable:
        warnings.append(
            "Could not parse HUD AHAR index from local HTTP request; using verified 2024 AHAR resource page fallback."
        )
        return FALLBACK_RELEASE_YEAR, FALLBACK_AHAR_RESOURCE_PAGE_URL

    candidates: list[tuple[int, str]] = []
    for link in parse_links(result.body, AHAR_INDEX_URL):
        match = re.search(r"\b(20\d{2})\s+AHAR:\s+Part\s+1\s+-\s+PIT", link["text"])
        if match:
            candidates.append((int(match.group(1)), link["href"]))

    if not candidates:
        warnings.append(
            "HUD AHAR index was fetched but no AHAR Part 1 resource links were recognized; using verified 2024 fallback."
        )
        return FALLBACK_RELEASE_YEAR, FALLBACK_AHAR_RESOURCE_PAGE_URL

    return max(candidates, key=lambda item: item[0])


def extract_posted_date(html: str) -> str | None:
    text = html_to_text(html)
    match = re.search(r"Posted Date:\s*([A-Za-z]+\s+\d{4})", text)
    if match:
        return match.group(1)
    return None


def discover_hud_resource_links(
    resource_page_url: str,
    fetch_log: list[dict[str, object]],
    warnings: list[str],
) -> tuple[list[dict[str, str]], str | None, str]:
    result = fetch_text(resource_page_url)
    fetch_log.append(result.to_log())

    if result.usable:
        links = [
            link
            for link in parse_links(result.body, resource_page_url)
            if extension_for_url(link["href"]) in {"pdf", "xlsb", "xlsx", "csv"}
        ]
        if links:
            return links, extract_posted_date(result.body), "hud_resource_page_parse"
        warnings.append(
            "HUD AHAR resource page was fetched but no PDF/XLSB/XLSX/CSV resource links were recognized; using verified 2024 fallback."
        )
    else:
        warnings.append(
            "Could not parse HUD AHAR resource page from local HTTP request; using verified 2024 resource link fallback."
        )

    return list(FALLBACK_RESOURCE_LINKS), "December 2024", "verified_2024_fallback"


def discover_coc_geography_source(
    discovered_at: str,
    fetch_log: list[dict[str, object]],
    warnings: list[str],
) -> dict[str, object]:
    result = fetch_text(
        f"{HUD_COC_FEATURE_SERVICE_URL}?f=pjson",
        accept="application/json,*/*;q=0.8",
    )
    fetch_log.append(result.to_log())

    service_metadata: dict[str, object] = {}
    if result.usable:
        try:
            parsed = json.loads(result.body)
            service_metadata = {
                "name": parsed.get("name"),
                "geometry_type": parsed.get("geometryType"),
                "object_id_field": parsed.get("objectIdField"),
                "fields": [
                    field.get("name")
                    for field in parsed.get("fields", [])
                    if isinstance(field, dict) and field.get("name")
                ],
            }
        except json.JSONDecodeError as error:
            warnings.append(f"Could not parse HUD CoC FeatureServer JSON metadata: {error}")
    else:
        warnings.append("Could not fetch HUD CoC FeatureServer metadata during discovery.")

    return {
        "source_id": "hud-coc-geography-fy2024",
        "source_name": "FY2024 Continuum of Care geography FeatureServer",
        "source_url": HUD_COC_GEOJSON_URL,
        "service_metadata_url": f"{HUD_COC_FEATURE_SERVICE_URL}?f=pjson",
        "publisher": "U.S. Department of Housing and Urban Development",
        "release_year": 2024,
        "boundary_year": 2024,
        "dataset_kind": "geography",
        "geography_level": "coc",
        "file_name": None,
        "file_extension": "geojson",
        "file_hash": None,
        "file_size_bytes": None,
        "retrieved_at": None,
        "discovered_at": discovered_at,
        "license_or_usage_note": "HUD GIS FeatureServer public layer.",
        "required_for_mvp": False,
        "service_metadata": service_metadata,
    }


def run_discover() -> int:
    discovered_at = now_utc_iso()
    fetch_log: list[dict[str, object]] = []
    warnings: list[str] = []

    release_year, resource_page_url = discover_latest_resource_page(fetch_log, warnings)
    resource_links, published_date, discovery_method = discover_hud_resource_links(
        resource_page_url,
        fetch_log,
        warnings,
    )

    sources = [
        source_record_from_link(
            link,
            release_year=release_year,
            source_page_url=resource_page_url,
            published_date=published_date,
        )
        for link in resource_links
    ]
    sources = sorted(sources, key=lambda source: str(source["source_id"]))
    geography_sources = [
        discover_coc_geography_source(discovered_at, fetch_log, warnings),
    ]

    manifest = {
        "schema_version": "homelessness-source-manifest/v1",
        "dataset": "hud_ahar_homelessness",
        "discovered_at": discovered_at,
        "latest_release_year": release_year,
        "latest_release_label": f"{release_year} AHAR: Part 1 - PIT Estimates of Homelessness in the U.S.",
        "source_pages": [
            {
                "source_id": "hud-ahar-index",
                "label": "HUD AHAR reports",
                "url": AHAR_INDEX_URL,
            },
            {
                "source_id": f"hud-ahar-{release_year}-resource-page",
                "label": f"{release_year} AHAR Part 1 resource page",
                "url": resource_page_url,
            },
            {
                "source_id": "hud-dataset-update-schedule",
                "label": "HUD dataset update schedule",
                "url": AHAR_UPDATE_SCHEDULE_URL,
            },
        ],
        "sources": sources,
        "geography_sources": geography_sources,
        "discovery": {
            "method": discovery_method,
            "warnings": warnings,
            "fetch_log": fetch_log,
        },
    }

    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"wrote: {SOURCE_MANIFEST_PATH.relative_to(PROJECT_ROOT)}")
    print(f"latest_release_year: {release_year}")
    print(f"sources: {len(sources)}")
    print(f"geography_sources: {len(geography_sources)}")
    print(f"discovery_method: {discovery_method}")
    if warnings:
        print("warnings:")
        for warning in warnings:
            print(f"- {warning}")

    return 0


def run_doctor() -> int:
    python_ok = sys.version_info >= MINIMUM_PYTHON
    print("Homelessness data pipeline runtime")
    print(f"python: {platform.python_version()} ({sys.executable})")
    print(f"minimum_python: {MINIMUM_PYTHON[0]}.{MINIMUM_PYTHON[1]}")
    print(f"python_ok: {'yes' if python_ok else 'no'}")
    print("")
    print("dependencies:")

    all_ok = python_ok
    for item in REQUIRED_DISTRIBUTIONS:
        importable = importlib.util.find_spec(item.import_name) is not None
        import_error = None
        if importable:
            try:
                importlib.import_module(item.import_name)
            except Exception as error:  # pragma: no cover - surfaced by CLI output.
                importable = False
                import_error = str(error)
        installed_version = distribution_version(item.distribution_name)
        version_ok = installed_version == item.expected_version
        ok = importable and version_ok
        all_ok = all_ok and ok
        if ok:
            status = "ok"
        elif import_error:
            status = "import-error"
        elif not importable:
            status = "missing"
        else:
            status = "version-mismatch"
        found = installed_version or "not installed"
        print(
            f"- {item.distribution_name}: {status}; "
            f"expected={item.expected_version}; found={found}; reason={item.reason}"
        )
        if import_error:
            print(f"  import_error: {import_error}")

    if all_ok:
        print("")
        print("ready: yes")
        return 0

    print("")
    print("ready: no")
    print("setup: pnpm data:setup")
    return 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Homelessness data pipeline utilities.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser(
        "doctor",
        help="Check the local Python ETL runtime and pinned dependencies.",
    )
    subparsers.add_parser(
        "discover",
        help="Discover official HUD homelessness source URLs and write the source manifest.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "doctor":
        return run_doctor()
    if args.command == "discover":
        return run_discover()

    parser.error(f"unknown command: {args.command}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
