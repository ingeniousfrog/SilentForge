import { realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export function isDirectModuleExecution(moduleUrl: string): boolean {
  const invoked = process.argv[1];
  if (!invoked) {
    return false;
  }

  const entry = fileURLToPath(moduleUrl);

  try {
    return realpathSync(invoked) === realpathSync(entry);
  } catch {
    return fileURLToPath(pathToFileURL(invoked)) === entry;
  }
}
