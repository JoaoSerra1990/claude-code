import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Em ambientes que já trazem um Chromium (ex.: sessão na nuvem), usa esse em
// vez de baixar outro. REMOTION_BROWSER aponta para um binário específico.
const findPreinstalledBrowser = (): string | null => {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const root = "/opt/pw-browsers";
  if (!existsSync(root)) return null;
  const dir = readdirSync(root).find((d) => d.startsWith("chromium_headless_shell-"));
  if (!dir) return null;
  const bin = join(root, dir, "chrome-headless-shell-linux64", "chrome-headless-shell");
  return existsSync(bin) ? bin : null;
};

const browser = findPreinstalledBrowser();
if (browser) Config.setBrowserExecutable(browser);
