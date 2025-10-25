import path from "node:path";
import { config } from "../config.js";
import { SymbolRowSchema, SymbolLookupSchema, type SymbolLookup, type SymbolRow } from "@xm-schema/shared";
import { loadJson } from "../helpers/json.js";

class SymbolsError extends Error {}

let cacheArray: SymbolLookup[] | null = null;
let cacheMap: Map<string, string> | null = null;

const filePath = path.resolve(config.symbolsFilePath);

function loadNow(): void {
  const rows = loadJson<unknown>(filePath);
  const parsed = (Array.isArray(rows) ? rows : []);
  const validated = parsed.map((r) => SymbolRowSchema.parse(r as SymbolRow));
  const simplified = validated.map(r => SymbolLookupSchema.parse({
    value: r.Symbol,
    label: `${r["Company Name"]} (${r.Symbol})`,
  }));
  cacheArray = simplified;
  cacheMap = new Map(validated.map(r => [r.Symbol, r["Company Name"]]));
}

export function preloadSymbols(): void {
  try {
    loadNow();
  } catch (err) {
    console.error("Fatal: cannot load symbols:",  );
    throw err;
  }
}

export function getSymbols(): SymbolLookup[] {
  if (!cacheArray) throw new SymbolsError("Symbols cache not initialized");
  return cacheArray;
}

export function getCompanyName(symbol: string): string | null {
  if (!cacheMap) throw new SymbolsError("Symbols cache not initialized");
  return cacheMap.get(symbol) ?? null;
}
