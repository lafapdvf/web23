import { describe, expect, test } from "@jest/globals";
import Block from "../src/lib/block";

describe("Block", () => {
  test("Should be valid", () => {
    const block = new Block(1, "abc", "block 2");
    const valid = block.isValid();
    expect(valid).toBeTruthy();
  });

  test("Should NOT be valid (previous hash)", () => {
    const block = new Block(1, "", "block 2");
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block(1, "abc", "block 2");
    block.timestamp = -1;
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  });

  test("Should NOT be valid (hash)", () => {
    const block = new Block(1, "abc", "block 2");
    block.hash = "";
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block(1, "abc", "");
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block(-1, "abc", "block 2");
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  });
});
