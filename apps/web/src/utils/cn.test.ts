import cn from "./cn";
import { expect, test } from "vitest";

test("cn joins truthy strings", () => {
  expect(cn("a", false && "b", undefined, "c")).toBe("a c");
});
test("cn handles no arguments", () => {
  expect(cn()).toBe("");
});