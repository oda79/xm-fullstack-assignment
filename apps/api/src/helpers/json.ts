import fs from "node:fs";

export function loadJson<T>(filePath: string): T {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    return JSON.parse(text);
  } catch (err: any) {
    if (err.code === "ENOENT") throw err; 
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${err.message}`);
    }
    throw err;
  }
}