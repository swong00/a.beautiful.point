// Build-time loader for the pinned Transparency in Coverage display assets.
// Reads only the checked-in files under public/data/transparency-in-coverage/
// (verified and pinned by scripts/import-tic-pricing-slice-v0.mjs); the build
// has no sibling-checkout, stage-volume, or network dependency. The imports
// resolve at build time only — no data enters a client bundle.

export interface TicFact {
  fact_key: string;
  amount: number;
  billing_class: string;
  negotiated_type: string;
  service_codes: string[];
  service_name: string;
  service_description: string;
  expiration_date: string;
  provider_group_id: string;
}

export interface TicCodeAsset {
  path: string;
  row_count: number;
  byte_size: number;
  sha256: string;
}

export interface TicRelease {
  schema_version: string;
  generated_at: string;
  exporter_version: string;
  projection_version: string;
  release_commit: string;
  sources: Record<string, { path: string; sha256: string; byte_size: number }>;
  source_metadata: {
    payer: string;
    geography: string;
    reporting_month: string;
    currency_assumption: string;
    currency_source_status: string;
    freshness_status: string;
    plan_attribution_status: string;
    billing_code_type: string;
    billing_code_type_version: string;
    schema_version: string;
    source_last_updated_on: string | null;
    source_files: string[];
  };
  totals: { row_count: number; code_count: number };
  codes: Record<string, TicCodeAsset>;
}

export const DEFAULT_CODE = "99204";
export const LAB_BASE_PATH = "/labs/anatomy-of-a-published-healthcare-rate";

const releaseModules = import.meta.glob<TicRelease>(
  "../../public/data/transparency-in-coverage/release.json",
  { eager: true, import: "default" },
);
const codeModules = import.meta.glob<TicFact[]>(
  "../../public/data/transparency-in-coverage/codes/*.json",
  { eager: true, import: "default" },
);

export function loadRelease(): TicRelease {
  const release = Object.values(releaseModules)[0];
  if (!release) {
    throw new Error(
      "Missing public/data/transparency-in-coverage/release.json — run scripts/import-tic-pricing-slice-v0.mjs.",
    );
  }
  return release;
}

export function contractCodes(): string[] {
  return Object.keys(loadRelease().codes).sort();
}

const factsCache = new Map<string, TicFact[]>();

export function loadCodeFacts(code: string): TicFact[] {
  const cached = factsCache.get(code);
  if (cached) return cached;
  const asset = loadRelease().codes[code];
  if (!asset) throw new Error(`Unknown contract code: ${code}`);
  const module = Object.entries(codeModules).find(([path]) =>
    path.endsWith(`/codes/${code}.json`),
  );
  if (!module) {
    throw new Error(`Missing checked-in asset for contract code ${code}.`);
  }
  // Copy before sorting: deterministic fact_key order so no listing can read
  // as a ranking.
  const facts = [...module[1]].sort((a, b) => (a.fact_key < b.fact_key ? -1 : 1));
  if (facts.length !== asset.row_count) {
    throw new Error(
      `Checked-in asset for ${code} has ${facts.length} facts but release.json declares ${asset.row_count}.`,
    );
  }
  factsCache.set(code, facts);
  return facts;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
