#!/usr/bin/env node
/**
 * wikipefia-mdx — CLI for validating MDX content.
 *
 * Usage:
 *   wikipefia-mdx validate [dir]              Validate all MDX in directory
 *   wikipefia-mdx validate [dir] --type subject  Also validate config.json
 *   wikipefia-mdx validate [dir] --type teacher  Also validate teacher config
 *
 * Examples:
 *   wikipefia-mdx validate .                  Validate current directory
 *   wikipefia-mdx validate ./articles         Validate articles subdirectory
 *   wikipefia-mdx validate . --type subject   Full subject repo validation
 *
 * Exit codes:
 *   0 = all valid (warnings are OK)
 *   1 = validation errors found
 *   2 = invalid arguments
 */

import path from "path";
import { existsSync } from "fs";
import { readFile, readdir, stat } from "fs/promises";
import { validateMDX } from "../validate.js";
import { SubjectConfig } from "../schemas/subject.js";
import { TeacherConfig } from "../schemas/teacher.js";
import { LOCALES } from "../schemas/shared.js";

// ── Colors (minimal, no dependencies) ────────────────

const isColor = process.stdout.isTTY && !process.env.NO_COLOR;
const red = (s: string) => (isColor ? `\x1b[31m${s}\x1b[0m` : s);
const green = (s: string) => (isColor ? `\x1b[32m${s}\x1b[0m` : s);
const yellow = (s: string) => (isColor ? `\x1b[33m${s}\x1b[0m` : s);
const dim = (s: string) => (isColor ? `\x1b[2m${s}\x1b[0m` : s);
const bold = (s: string) => (isColor ? `\x1b[1m${s}\x1b[0m` : s);

// ── Argument parsing ─────────────────────────────────

function parseArgs(argv: string[]) {
  const args = argv.slice(2); // skip node, script

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    return { command: "help" as const };
  }

  const command = args[0];
  if (command !== "validate") {
    return { command: "unknown" as const, raw: command };
  }

  const dir = args[1] || ".";
  let type: "subject" | "teacher" | undefined;

  const typeIdx = args.indexOf("--type");
  if (typeIdx !== -1 && args[typeIdx + 1]) {
    const t = args[typeIdx + 1];
    if (t === "subject" || t === "teacher") {
      type = t;
    } else {
      console.error(red(`Unknown content type: "${t}". Expected "subject" or "teacher".`));
      process.exit(2);
    }
  }

  return { command: "validate" as const, dir, type };
}

// ── Help ─────────────────────────────────────────────

function printHelp() {
  console.log(`
${bold("wikipefia-mdx")} — Validate MDX content for Wikipefia

${bold("USAGE")}
  wikipefia-mdx validate [dir] [--type subject|teacher]

${bold("COMMANDS")}
  validate    Validate MDX files in the given directory

${bold("OPTIONS")}
  --type      Content type: "subject" or "teacher"
              When specified, also validates config.json
  --help, -h  Show this help message

${bold("EXAMPLES")}
  wikipefia-mdx validate .
  wikipefia-mdx validate ./articles --type subject
  wikipefia-mdx validate . --type teacher
`);
}

// ── Config validation ────────────────────────────────

async function validateConfig(
  rootDir: string,
  type: "subject" | "teacher"
): Promise<boolean> {
  const configPath = path.join(rootDir, "config.json");

  if (!existsSync(configPath)) {
    console.log(red(`  ✗ config.json not found at ${configPath}`));
    return false;
  }

  let raw: unknown;
  try {
    const content = await readFile(configPath, "utf-8");
    raw = JSON.parse(content);
  } catch (err) {
    console.log(red(`  ✗ config.json is not valid JSON: ${err}`));
    return false;
  }

  const schema = type === "subject" ? SubjectConfig : TeacherConfig;
  const result = schema.safeParse(raw);

  if (!result.success) {
    console.log(red(`  ✗ config.json schema validation failed:`));
    for (const issue of result.error.issues) {
      console.log(red(`    - ${issue.path.join(".")}: ${issue.message}`));
    }
    return false;
  }

  console.log(green(`  ✓ config.json is valid`));
  return true;
}

// ── MDX validation ───────────────────────────────────

async function validateAllMDX(articlesDir: string): Promise<{
  errors: number;
  warnings: number;
  total: number;
}> {
  let errors = 0;
  let warnings = 0;
  let total = 0;

  for (const locale of LOCALES) {
    const localeDir = path.join(articlesDir, locale);
    if (!existsSync(localeDir)) continue;

    const entries = await readdir(localeDir);
    const mdxFiles = entries.filter((f) => f.endsWith(".mdx"));

    for (const file of mdxFiles) {
      const filePath = path.join(localeDir, file);
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) continue;

      total++;
      const source = await readFile(filePath, "utf-8");
      const relativePath = `${locale}/${file}`;

      const result = await validateMDX(source, {
        filePath: relativePath,
      });

      const fileErrors = result.diagnostics.filter(
        (d) => d.severity === "error"
      );
      const fileWarnings = result.diagnostics.filter(
        (d) => d.severity === "warning"
      );

      if (fileErrors.length > 0) {
        console.log(red(`  ✗ ${relativePath}`));
        for (const d of fileErrors) {
          const loc = d.line ? ` (line ${d.line})` : "";
          console.log(red(`    ${d.category}: ${d.message}${loc}`));
        }
        errors += fileErrors.length;
      }

      if (fileWarnings.length > 0) {
        if (fileErrors.length === 0) {
          console.log(yellow(`  ⚠ ${relativePath}`));
        }
        for (const d of fileWarnings) {
          const loc = d.line ? ` (line ${d.line})` : "";
          console.log(yellow(`    ${d.category}: ${d.message}${loc}`));
        }
        warnings += fileWarnings.length;
      }

      if (fileErrors.length === 0 && fileWarnings.length === 0) {
        console.log(green(`  ✓ ${relativePath}`));
      }
    }
  }

  return { errors, warnings, total };
}

// ── Main ─────────────────────────────────────────────

async function main() {
  const parsed = parseArgs(process.argv);

  if (parsed.command === "help") {
    printHelp();
    process.exit(0);
  }

  if (parsed.command === "unknown") {
    console.error(red(`Unknown command: "${parsed.raw}". Use --help for usage.`));
    process.exit(2);
  }

  const { dir, type } = parsed;
  const rootDir = path.resolve(dir);

  console.log("");
  console.log(bold("╔══════════════════════════════════════════════╗"));
  console.log(bold("║  WIKIPEFIA MDX VALIDATOR                     ║"));
  console.log(bold("╚══════════════════════════════════════════════╝"));
  console.log("");

  let configOk = true;

  // Validate config.json if type specified
  if (type) {
    console.log(bold(`▸ Validating ${type} config.json...`));
    configOk = await validateConfig(rootDir, type);
    console.log("");
  }

  // Determine articles directory
  const articlesDir = path.join(rootDir, "articles");
  if (!existsSync(articlesDir)) {
    console.error(red(`Articles directory not found: ${articlesDir}`));
    console.error(dim(`  Expected layout: ${dir}/articles/{locale}/*.mdx`));
    process.exit(1);
  }

  // Check _front.mdx presence
  console.log(bold("▸ Checking structure..."));
  let hasFront = false;
  for (const locale of LOCALES) {
    const frontPath = path.join(articlesDir, locale, "_front.mdx");
    if (existsSync(frontPath)) {
      console.log(green(`  ✓ articles/${locale}/_front.mdx exists`));
      hasFront = true;
    } else if (existsSync(path.join(articlesDir, locale))) {
      console.log(yellow(`  ⚠ articles/${locale}/_front.mdx is missing`));
    }
  }
  console.log("");

  // Validate all MDX files
  console.log(bold("▸ Validating MDX files..."));
  const { errors, warnings, total } = await validateAllMDX(articlesDir);

  // Summary
  console.log("");
  console.log("─".repeat(48));

  if (errors > 0 || !configOk) {
    console.log("");
    console.log(
      red(
        `✗ Validation FAILED: ${errors} error(s), ${warnings} warning(s) in ${total} file(s)`
      )
    );
    console.log("");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("");
    console.log(
      yellow(
        `✓ Validation passed with ${warnings} warning(s) in ${total} file(s)`
      )
    );
    console.log("");
  } else {
    console.log("");
    console.log(green(`✓ All ${total} file(s) valid — no errors, no warnings`));
    console.log("");
  }
}

main().catch((err) => {
  console.error(red(`Fatal error: ${err}`));
  process.exit(1);
});
