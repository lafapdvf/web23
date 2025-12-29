import { describe, expect, test } from "@jest/globals";
import Blockchain from "../src/lib/blockchain";

describe("Blockchain tests", () => {
  test("Should have genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toEqual(1);
  });
});
