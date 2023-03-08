import spawn from "@umijs/utils/compiled/cross-spawn";
import { logger } from "@umijs/utils";
import type { SpawnSyncOptions } from "child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { parse } from "yaml";

const ROOT = process.cwd();

export const PATHS = {
  ROOT,
  PACKAGES: join(ROOT, "./packages"),
  EXAMPLES: join(ROOT, "./examples"),
} as const;

export function getProjectPath() {
  const packagePath = join(process.cwd(), "package.json");
  const pnpmPath = join(process.cwd(), "pnpm-workspace.yaml");
  const rootDir = dirname(packagePath);

  // 检查是否是 Yarn Monorepo
  if (existsSync(packagePath)) {
    const packageJson = require(packagePath);
    if (packageJson.workspaces && Array.isArray(packageJson.workspaces)) {
      const workspaceFolders = packageJson.workspaces;

      if (workspaceFolders.length > 0) {
        const workspaceDirs = workspaceFolders.map((folder: string) =>
          dirname(join(rootDir, folder))
        );

        if (workspaceDirs.length > 0) {
          return workspaceDirs[0];
        }
      }
    }
  }

  // 检查是否是 pnpm Monorepo
  if (existsSync(pnpmPath)) {
    const pnpmConfig = readFileSync(pnpmPath, "utf8");
    const { packages } = parse(pnpmConfig);
    if (packages && packages.length > 0) {
      return dirname(join(rootDir, packages[0]));
    }
  }

  // 返回当前工作目录
  return process.cwd();
}

export function getPkgs(opts?: { base?: string }): string[] {
  const base = opts?.base || getProjectPath() || PATHS.PACKAGES;
  return readdirSync(base).filter((dir) => {
    return !dir.startsWith(".") && existsSync(join(base, dir, "package.json"));
  });
}

export function eachPkg(
  pkgs: string[],
  fn: (opts: {
    name: string;
    dir: string;
    pkgPath: string;
    pkgJson: Record<string, any>;
  }) => void,
  opts?: { base?: string }
) {
  const base = opts?.base || PATHS.PACKAGES;
  pkgs.forEach((pkg) => {
    fn({
      name: pkg,
      dir: join(base, pkg),
      pkgPath: join(base, pkg, "package.json"),
      pkgJson: require(join(base, pkg, "package.json")),
    });
  });
}

export function assert(v: unknown, message: string) {
  if (!v) {
    logger.error(message);
    process.exit(1);
  }
}

export function setExcludeFolder(opts: {
  cwd: string;
  pkg: string;
  dirName?: string;
  folders?: string[];
}) {
  const dirName = opts.dirName || "packages";
  const folders = opts.folders || ["dist", "compiled", ".turbo"];
  if (!existsSync(join(opts.cwd, ".idea"))) return;
  const configPath = join(opts.cwd, ".idea", "umi.iml");
  let content = readFileSync(configPath, "utf-8");
  for (const folder of folders) {
    const excludeContent = `<excludeFolder url='file://$MODULE_DIR$/${dirName}/${opts.pkg}/${folder}' />`;
    const replaceMatcher = `<content url="file://$MODULE_DIR$">`;
    if (!content.includes(excludeContent)) {
      content = content.replace(
        replaceMatcher,
        `${replaceMatcher}\n      ${excludeContent}`
      );
    }
  }
  writeFileSync(configPath, content, "utf-8");
}

export function spawnSync(cmd: string, opts: SpawnSyncOptions) {
  const result = spawn.sync(cmd, {
    shell: true,
    stdio: "inherit",
    ...opts,
  });
  if (result.status !== 0) {
    logger.error(`Execute command error (${cmd})`);
    process.exit(1);
  }
  return result;
}

export function toArray(v: unknown) {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
}
