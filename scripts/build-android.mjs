import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const androidRoot = path.join(repositoryRoot, "android");
const isWindows = process.platform === "win32";
const executable = isWindows ? "cmd.exe" : "./gradlew";
const args = isWindows
  ? ["/d", "/s", "/c", "gradlew.bat assembleDebug"]
  : ["assembleDebug"];
const result = spawnSync(executable, args, {
  cwd: androidRoot,
  stdio: "inherit",
  shell: false,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
