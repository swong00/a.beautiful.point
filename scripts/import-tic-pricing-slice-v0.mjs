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
for (const source of ["slice", "header", "validation_report"]) {
  const declared = manifest.sources?.[source];
  check(
    /^[0-9a-f]{64}$/.test(declared?.sha256 ?? "") && Number.isInteger(declared?.byte_size),
    `Manifest is missing the pinned ${source} content hash.`,
  );
}
check(
  Array.isArray(manifest.source_metadata?.source_files) &&
    manifest.source_metadata.source_files.length > 0,
  "Manifest is missing source-file lineage.",
);

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
  const payload = fs.readFileSync(filePath);
  check(
    payload.length === declared.byte_size,
    `Code ${code} byte size ${payload.length} does not match declared ${declared.byte_size}.`,
  );
  check(
    sha256(payload) === declared.sha256,
    `Code ${code} SHA-256 does not match its declared manifest hash.`,
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
