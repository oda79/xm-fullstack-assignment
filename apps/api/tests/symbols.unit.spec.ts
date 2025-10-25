import { beforeEach, describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let tmp!: string;
let symbolsFile!: string;

async function freshImport() {
  vi.resetModules();
  return await import("../src/services/symbols.js");
}

beforeEach(() => {
  // make a fresh temp dir + file for each test
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sym-"));
  symbolsFile = path.join(tmp, "symbols.json");
  process.env.SYMBOLS_FILE_PATH = symbolsFile;
});

describe("symbols service", () => {
  it("preloadSymbols loads and getSymbols/getCompanyName work", async () => {
    fs.writeFileSync(
      symbolsFile,
      JSON.stringify([
        { Symbol: "AAPL", "Company Name": "Apple Inc." },
        { Symbol: "MSFT", "Company Name": "Microsoft" },
      ]),
      "utf8"
    );

    const { preloadSymbols, getSymbols, getCompanyName } = await freshImport();

    // preload is sync -> just call and assert no throw
    expect(() => preloadSymbols()).not.toThrow();

    expect(getSymbols()).toEqual([
      { symbol: "AAPL", companyName: "Apple Inc." },
      { symbol: "MSFT", companyName: "Microsoft" },
    ]);

    expect(getCompanyName("AAPL")).toBe("Apple Inc.");
    expect(getCompanyName("MSFT")).toBe("Microsoft");
    // adjust based on your fallback (null vs symbol vs "n/a")
    expect(getCompanyName("GOOG")).toBeNull();
  });

  it("preloadSymbols throws on missing file", async () => {
    const { preloadSymbols } = await freshImport();
    expect(() => preloadSymbols()).toThrow();
  });

  it("preloadSymbols throws on invalid json", async () => {
    fs.writeFileSync(symbolsFile, "{not-json", "utf8");
    const { preloadSymbols } = await freshImport();
    expect(() => preloadSymbols()).toThrow(/Invalid JSON|Unexpected token/);
  });

  it("reload after file change (call preloadSymbols again)", async () => {
    const { preloadSymbols, getSymbols, getCompanyName } = await freshImport();

    // first load 1 symbol
    fs.writeFileSync(
      symbolsFile,
      JSON.stringify([{ Symbol: "AAPL", "Company Name": "Apple Inc." }]),
      "utf8"
    );
    expect(() => preloadSymbols()).not.toThrow();
    expect(getCompanyName("AAPL")).toBe("Apple Inc.");
    expect(getSymbols()).toHaveLength(1);

    // update file to include 2 symbols
    fs.writeFileSync(
      symbolsFile,
      JSON.stringify([
        { Symbol: "AAPL", "Company Name": "Apple Inc." },
        { Symbol: "MSFT", "Company Name": "Microsoft" },
      ]),
      "utf8"
    );
    expect(() => preloadSymbols()).not.toThrow();

    expect(getCompanyName("MSFT")).toBe("Microsoft");
    expect(getSymbols()).toHaveLength(2);
  });
});
