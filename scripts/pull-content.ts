#!/usr/bin/env tsx
/**
 * pull-content.ts — Fetches content from GitHub repositories.
 *
 * Reads content-sources.json and clones/downloads content repos
 * into the content/ directory.
 *
 * In CI (GITHUB_ACTIONS=true): uses GitHub API tarball download.
 * Locally: uses git clone --depth 1.
 */

import { readFile, mkdir, rm, cp } from "fs/promises";
import { existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import os from "os";

const ROOT = process.cwd();

interface ContentSource {
  repo: string;
  branch: string;
  path: string;
  targetDir: string;
}

interface ContentSources {
  subjects: ContentSource[];
  teachers: ContentSource[];
  system: ContentSource;
}

async function main() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   WIKIPEFIA CONTENT PULL             ║");
  console.log("╚══════════════════════════════════════╝\n");

  const sourcesPath = path.join(ROOT, "content-sources.json");
  if (!existsSync(sourcesPath)) {
    console.log("No content-sources.json found — skipping pull.");
    console.log("Using local content/ directory as-is.\n");
    return;
  }

  const raw = await readFile(sourcesPath, "utf-8");
  const sources: ContentSources = JSON.parse(raw);

  const isCI = process.env.GITHUB_ACTIONS === "true";
  const githubToken = process.env.GITHUB_TOKEN;

  const allSources: ContentSource[] = [
    ...(sources.subjects || []),
    ...(sources.teachers || []),
    ...(sources.system ? [sources.system] : []),
  ];

  console.log(`Found ${allSources.length} content source(s).`);
  console.log(`Mode: ${isCI ? "CI (GitHub Actions)" : "Local"}\n`);

  for (const source of allSources) {
    const targetPath = path.join(ROOT, source.targetDir);
    console.log(`▸ ${source.repo} → ${source.targetDir}`);

    // Skip if target already exists and we're local (content may be local-only)
    if (existsSync(targetPath) && !isCI) {
      console.log("  Already exists — skipping (local mode).");
      continue;
    }

    if (isCI && githubToken) {
      // Download tarball using GitHub API
      try {
        const tmpDir = path.join(
          os.tmpdir(),
          `wikipefia-pull-${Date.now()}`
        );
        await mkdir(tmpDir, { recursive: true });

        const tarballUrl = `https://api.github.com/repos/${source.repo}/tarball/${source.branch}`;
        execSync(
          `curl -sL -H "Authorization: token ${githubToken}" "${tarballUrl}" | tar xz -C "${tmpDir}" --strip-components=1`,
          { stdio: "pipe" }
        );

        // Ensure target dir exists and copy
        await mkdir(targetPath, { recursive: true });
        const sourcePath =
          source.path === "." ? tmpDir : path.join(tmpDir, source.path);
        await cp(sourcePath, targetPath, { recursive: true });

        // Cleanup
        await rm(tmpDir, { recursive: true, force: true });
        console.log("  ✓ Downloaded and extracted.");
      } catch (err: any) {
        console.error(`  ✗ Failed to download: ${err.message}`);
        process.exit(1);
      }
    } else {
      // Local: git clone
      try {
        const tmpDir = path.join(
          os.tmpdir(),
          `wikipefia-clone-${Date.now()}`
        );
        execSync(
          `git clone --depth 1 --branch ${source.branch} https://github.com/${source.repo}.git "${tmpDir}"`,
          { stdio: "pipe" }
        );

        await mkdir(targetPath, { recursive: true });
        const sourcePath =
          source.path === "." ? tmpDir : path.join(tmpDir, source.path);
        await cp(sourcePath, targetPath, { recursive: true });

        await rm(tmpDir, { recursive: true, force: true });
        console.log("  ✓ Cloned and copied.");
      } catch {
        console.log(
          "  ⚠ Clone failed (repo may not exist yet). Skipping."
        );
      }
    }
  }

  // Verify structure
  console.log("\n▸ Verifying content structure...");
  let valid = true;

  for (const source of sources.subjects || []) {
    const dir = path.join(ROOT, source.targetDir);
    if (!existsSync(path.join(dir, "config.json"))) {
      console.error(`  ✗ Missing config.json in ${source.targetDir}`);
      valid = false;
    }
    if (!existsSync(path.join(dir, "articles"))) {
      console.error(`  ✗ Missing articles/ in ${source.targetDir}`);
      valid = false;
    }
  }

  for (const source of sources.teachers || []) {
    const dir = path.join(ROOT, source.targetDir);
    if (!existsSync(path.join(dir, "config.json"))) {
      console.error(`  ✗ Missing config.json in ${source.targetDir}`);
      valid = false;
    }
    if (!existsSync(path.join(dir, "articles"))) {
      console.error(`  ✗ Missing articles/ in ${source.targetDir}`);
      valid = false;
    }
  }

  if (valid) {
    console.log("  ✓ All content directories verified.\n");
  } else {
    console.error(
      "\n✗ Content structure verification failed. Check the errors above.\n"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n✗ Pull failed:", err);
  process.exit(1);
});
