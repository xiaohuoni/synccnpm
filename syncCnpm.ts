import { logger, winPath } from "@umijs/utils";
import "zx/globals";
import { getPkgs, getProjectPath } from "./.internal/utils";
import { join } from "path";

const cnpm = winPath(join(__dirname, "./node_modules/.bin/cnpm"));

(async () => {
  const base = getProjectPath();
  const pkgs = getPkgs({ base });

  // sync tnpm
  logger.event("sync cnpm");
  // 保留日志
  // $.verbose = false;
  if (pkgs && pkgs.length === 0) {
    const { name, private: skip } = require(path.join(base, "package.json"));
    if (!skip) {
      logger.info(`sync ${name}`);
      await $`${cnpm} sync ${name}`;
    }
  } else {
    logger.info(`pkgs: ${pkgs.join(", ")}`);

    await Promise.all(
      pkgs.map(async (pkg) => {
        const { name, private: skip } = require(path.join(
          base,
          pkg,
          "package.json"
        ));
        if (!skip) {
          logger.info(`sync ${name}`);
          await $`${cnpm} sync ${name}`;
        }
      })
    );
  }
  // $.verbose = true;
})();
