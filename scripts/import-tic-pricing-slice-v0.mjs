#!/usr/bin/env node
// Pinned import for the Transparency in Coverage pricing-slice v0 display assets.
//
// Verifies an export package produced by the pipelines command
// `export-pricing-slice-v0-public-assets` — manifest schema, the expected
// release commit, and every declared hash, byte size, and row count — before
// atomically replacing public/data/transparency-in-coverage/. The verified
// manifest is committed alongside the assets as release.json. Declared under
// exec plan 007; the site build must never read the sibling pipeline checkout.

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const MANIFEST_SCHEMA_VERSION =
  "transparency-in-coverage-pricing-slice-v0-public-assets-manifest/v1";
const PROJECTION_VERSION = "tic-pricing-slice-v0-display-projection/v1";
const CONTRACT_CODES = [
  "45378", "70450", "70553", "72148", "74177", "77067", "80048", "80053",
  "80061", "81003", "84443", "85025", "99203", "99204", "99205",
];
const PROJECTED_FACT_FIELDS = [
  "amount",
  "billing_class",
  "expiration_date",
  "fact_key",
  "negotiated_type",
  "provider_group_id",
  "service_codes",
  "service_description",
  "service_name",
];

// Trusted release descriptors, independent of any manifest the package ships.
// Source values were computed from the pipelines repository itself
// (`git show <release>:<path> | shasum -a 256`); per-code values were pinned
// after the 2026-08-30 independent full reconciliation of every fact against
// the release slice (exporter output is byte-deterministic for a release).
// `source_metadata` is pinned the same way -- read back out of the release
// slice at `git show <release>:<slice path>` as the fields constant across all
// 12,183 facts, plus the sorted distinct `source_file_path` lineage -- because
// those values are the page's public lineage claims and appear in no hashed
// per-code payload; without a pin, a manifest could restate the payer,
// reporting month, or source URLs while every file hash still verified.
// A manifest that disagrees with its release's descriptor is refused outright.
const RELEASE_PINS = {
  b69ad4fd10fb128af66ffe48768c8a7f115b4d16: {
    sources: {
      slice: {
        path: "domains/transparency-in-coverage/public-contract/pricing-slice-v0.jsonl",
        sha256: "8e03a7773aa59af713b39119d15f30dfe7aa3125b27a8e0479ed6c36f1199683",
        byte_size: 14177310,
        row_count: 12183,
      },
      header: {
        path: "domains/transparency-in-coverage/public-contract/pricing-slice-v0-header.json",
        sha256: "dd12bf1d2619ede1bec98283eac2c6aba35a67556d76375fa0a6e1d1fdeef851",
        byte_size: 382,
      },
      validation_report: {
        path: "domains/transparency-in-coverage/data/reports/pricing-slice-v0-validation-report.json",
        sha256: "cf20af7be0a4de90cb7ef8d5b5f669a35432b0e7af63e40699532995bee1cfbd",
        byte_size: 1720,
      },
    },
    total_row_count: 12183,
    source_metadata: {
      payer: "Cigna",
      geography: "CO",
      reporting_month: "2026-07",
      currency_assumption: "USD",
      currency_source_status: "not_stated_in_source_schema",
      freshness_status: "source_file_as_of_reported_month_not_currentness_claim",
      plan_attribution_status: "not_observed_in_slice_non_selecting",
      billing_code_type: "CPT",
      billing_code_type_version: "2026",
      schema_version: "transparency-in-coverage-pricing-slice/v0",
      source_last_updated_on: null,
      source_files: [
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_colorado-cpop_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_denver-co-connect-network_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_health-care-alliance-of-the-front-range_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_localplus_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_national-oap_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_national-ppo_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_pathwell-oap_in-network-rates.json.gz",
        "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/state_mrf/CO/in-network-rates/reporting_month=2026-07/2026-07-01_CO_cigna-health-life-insurance-company_pathwell-ppo_in-network-rates.json.gz",
      ],
    },
    codes: {
      "45378": { sha256: "5d9548cce80711cc9068d76127a6c83d54973c3687347001df68780868d5a9f9", byte_size: 161279, row_count: 371 },
      "70450": { sha256: "9eb260eadba3c367ea677e7bc9760a8d26ca823d687190dbddaf3ac8a8accb0f", byte_size: 188111, row_count: 530 },
      "70553": { sha256: "bce03cd81776bea27907be3d796119a3734a60923b0dd324f54db6a5ce447eca", byte_size: 195392, row_count: 535 },
      "72148": { sha256: "8eabadf8a741c7061eec358a823041f6795cf809c9a82fc49b91f25877fe330d", byte_size: 217854, row_count: 602 },
      "74177": { sha256: "993f194a298c1609764217ac4eb721724ff1b31949beb502ee298a4fc7339b11", byte_size: 258335, row_count: 707 },
      "77067": { sha256: "3bb1b87304e0addf1be39cc6b65776529196786d37f4138cedac9563b81a9108", byte_size: 428875, row_count: 1191 },
      "80048": { sha256: "502ed2fa9c3091c7a111de79d02ad3d5c5da9b480545e42bd60963ffc2a1de62", byte_size: 111976, row_count: 307 },
      "80053": { sha256: "65ca8fce540d18c10b9fc57a940228aaba20ce312d8a4c5ac1bc15b73b998f2e", byte_size: 156037, row_count: 434 },
      "80061": { sha256: "35814ad77c76adde83f074859d179e71d4ee45ce8be9564cc11cb997ce2c597b", byte_size: 167446, row_count: 504 },
      "81003": { sha256: "b8d3e9a24f4a5b02a50a782a0c7983661af3dcf55637eba49ead25ddac6982cf", byte_size: 176379, row_count: 490 },
      "84443": { sha256: "939e60d470256395a1f53f450bc15c3bc49440e01df4d2565462202f78c5e16b", byte_size: 125212, row_count: 346 },
      "85025": { sha256: "b56d721e005a3ddbfe0b039746119efef06a5703f87ad5ae22f0544306d7af32", byte_size: 160817, row_count: 440 },
      "99203": { sha256: "3cb32d5828be9b36a33e9a1ef120f06a3e435bda59eae3f2d589cb04adcdee13", byte_size: 913059, row_count: 1991 },
      "99204": { sha256: "421c54f4b6cef42d01d6021f19bf69a73d5b21e99900e9dfa895bc90cd6e8c51", byte_size: 874117, row_count: 1994 },
      "99205": { sha256: "57cc3f9f38ab8184b39bea83e4afa74532f01c98afbca2d506efbc4b922e7894", byte_size: 713230, row_count: 1741 },
    },
  },
};

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDir = path.join(siteRoot, "public", "data", "transparency-in-coverage");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (!flag?.startsWith("--") || value === undefined) {
      throw new Error(`Unexpected argument: ${flag}`);
    }
    args[flag.slice(2)] = value;
  }
  return args;
}

const blockers = [];
const check = (condition, message) => {
  if (!condition) blockers.push(message);
};

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args["expected-release"]) {
  console.error(
    "usage: node scripts/import-tic-pricing-slice-v0.mjs --input <export-package> --expected-release <commit>",
  );
  process.exit(2);
}
const packageDir = path.resolve(args.input);
const expectedRelease = args["expected-release"];

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

// Value-equality serialization: object keys are ordered so key order alone
// never reads as tampering, while array order stays significant (the exporter
// writes source_files sorted).
const canonicalJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
};

const manifestPath = path.join(packageDir, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error(`blocking: missing manifest: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

check(
  manifest.schema_version === MANIFEST_SCHEMA_VERSION,
  `Unexpected manifest schema_version: ${manifest.schema_version}`,
);
check(
  manifest.projection_version === PROJECTION_VERSION,
  `Unexpected projection_version: ${manifest.projection_version}`,
);
check(
  manifest.release_commit === expectedRelease,
  `Manifest release_commit ${manifest.release_commit} does not equal the expected release ${expectedRelease}; the reusable v0 label alone is not a pin.`,
);
const pins = RELEASE_PINS[expectedRelease];
if (!pins) {
  console.error(
    `blocking: no trusted release descriptor for ${expectedRelease}; add its independently computed pins to RELEASE_PINS before importing.`,
  );
  process.exit(1);
}
for (const source of ["slice", "header", "validation_report"]) {
  const declared = manifest.sources?.[source];
  const pinned = pins.sources[source];
  check(
    declared?.sha256 === pinned.sha256 && declared?.byte_size === pinned.byte_size,
    `Manifest ${source} hash/size do not match the trusted release descriptor (declared ${declared?.sha256}/${declared?.byte_size}, pinned ${pinned.sha256}/${pinned.byte_size}).`,
  );
  // The path is republished in release.json as the lineage of the hash beside
  // it, so it is pinned rather than accepted as declared.
  const differingFields = Object.keys(pinned)
    .filter((field) => canonicalJson(declared?.[field]) !== canonicalJson(pinned[field]))
    .sort();
  check(
    differingFields.length === 0,
    `Manifest ${source} declaration does not match the trusted release descriptor (differing: ${differingFields.join(", ")}).`,
  );
}
check(
  manifest.totals?.row_count === pins.total_row_count,
  `Manifest total row count ${manifest.totals?.row_count} does not match the trusted release descriptor's ${pins.total_row_count}.`,
);
// The page states its payer, geography, reporting month and source-file
// lineage straight out of source_metadata, and none of it is covered by a
// per-code payload hash, so it is compared against the pinned descriptor.
const declaredMetadata = manifest.source_metadata;
if (
  declaredMetadata === null ||
  typeof declaredMetadata !== "object" ||
  Array.isArray(declaredMetadata)
) {
  blockers.push(
    "Manifest is missing source_metadata; the page's public lineage claims are unverifiable.",
  );
} else {
  const differing = [
    ...new Set([
      ...Object.keys(pins.source_metadata),
      ...Object.keys(declaredMetadata),
    ]),
  ]
    .filter(
      (field) =>
        canonicalJson(declaredMetadata[field]) !==
        canonicalJson(pins.source_metadata[field]),
    )
    .sort();
  check(
    differing.length === 0,
    `Manifest source_metadata does not match the trusted release descriptor (differing: ${differing.join(", ")}); these values are the page's public lineage claims.`,
  );
}

const declaredCodes = Object.keys(manifest.codes ?? {}).sort();
check(
  JSON.stringify(declaredCodes) === JSON.stringify(CONTRACT_CODES),
  `Manifest codes ${declaredCodes.join(",")} do not equal the fifteen contract codes.`,
);

let totalRows = 0;
const verifiedFiles = new Map();
for (const code of declaredCodes) {
  const declared = manifest.codes[code];
  if (declared?.path !== `codes/${code}.json`) {
    blockers.push(`Code ${code} declares an unexpected path: ${declared?.path}`);
    continue;
  }
  const filePath = path.join(packageDir, declared.path);
  if (!fs.existsSync(filePath)) {
    blockers.push(`Missing declared file: ${declared.path}`);
    continue;
  }
  const pin = pins.codes[code];
  check(
    declared.sha256 === pin.sha256 &&
      declared.byte_size === pin.byte_size &&
      declared.row_count === pin.row_count,
    `Code ${code} manifest declaration does not match the trusted release descriptor.`,
  );
  const payload = fs.readFileSync(filePath);
  check(
    payload.length === pin.byte_size,
    `Code ${code} byte size ${payload.length} does not match the pinned ${pin.byte_size}.`,
  );
  check(
    sha256(payload) === pin.sha256,
    `Code ${code} SHA-256 does not match its pinned release hash.`,
  );
  let facts;
  try {
    facts = JSON.parse(payload.toString("utf8"));
  } catch (error) {
    blockers.push(`Code ${code} payload is not valid JSON: ${error.message}`);
    continue;
  }
  check(
    Array.isArray(facts) && facts.length === declared.row_count,
    `Code ${code} row count ${facts?.length} does not match declared ${declared.row_count}.`,
  );
  if (Array.isArray(facts)) {
    for (const fact of facts) {
      const fields = Object.keys(fact).sort();
      if (JSON.stringify(fields) !== JSON.stringify(PROJECTED_FACT_FIELDS)) {
        blockers.push(`Code ${code} carries a fact outside the display projection.`);
        break;
      }
    }
    totalRows += facts.length;
  }
  verifiedFiles.set(declared.path, payload);
}
check(
  totalRows === manifest.totals?.row_count,
  `Summed rows ${totalRows} do not match manifest total ${manifest.totals?.row_count}.`,
);

if (blockers.length > 0) {
  for (const finding of blockers) console.error(`blocking: ${finding}`);
  console.error("Import failed before replacement; existing assets are untouched.");
  process.exit(1);
}

// All hashes verified — atomically replace the committed asset directory.
fs.mkdirSync(path.dirname(targetDir), { recursive: true });
const stagingDir = fs.mkdtempSync(path.join(path.dirname(targetDir), ".import-tic-"));
try {
  fs.mkdirSync(path.join(stagingDir, "codes"));
  for (const [relativePath, payload] of verifiedFiles) {
    fs.writeFileSync(path.join(stagingDir, relativePath), payload);
  }
  fs.writeFileSync(
    path.join(stagingDir, "release.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  const previousDir = `${targetDir}.previous-${Date.now()}`;
  if (fs.existsSync(targetDir)) fs.renameSync(targetDir, previousDir);
  fs.renameSync(stagingDir, targetDir);
  if (fs.existsSync(previousDir)) fs.rmSync(previousDir, { recursive: true });
} finally {
  if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true });
}

console.log(`verified release ${expectedRelease}`);
console.log(`imported ${totalRows} facts across ${declaredCodes.length} codes`);
console.log(`wrote ${path.relative(siteRoot, targetDir)}`);
