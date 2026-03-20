import assert from "node:assert/strict";
import test from "node:test";
import { findPiModelOverride } from "../../src/provider/model-override.js";

test("findPiModelOverride returns correct override for composer-1", () => {
  const override = findPiModelOverride("composer-1");
  assert.equal(override.reasoning, false);
  assert.deepEqual(override.input, ["text", "image"]);
  assert.equal(override.cost.input, 1.25);
  assert.equal(override.cost.output, 10);
  assert.equal(override.contextWindow, 200000);
  assert.equal(override.maxTokens, 4000);
});

test("findPiModelOverride returns correct override for composer-1.5", () => {
  const override = findPiModelOverride("composer-1.5");
  assert.equal(override.reasoning, true);
  assert.deepEqual(override.input, ["text", "image"]);
  assert.equal(override.cost.input, 3.5);
  assert.equal(override.cost.output, 17.5);
});

test("findPiModelOverride returns correct override for composer-2", () => {
  const override = findPiModelOverride("composer-2");
  assert.equal(override.reasoning, true);
  assert.deepEqual(override.input, ["text", "image"]);
  assert.equal(override.cost.input, 0.5);
  assert.equal(override.cost.output, 2.5);
  assert.equal(override.cost.cacheRead, 0.2);
  assert.equal(override.contextWindow, 200000);
  assert.equal(override.maxTokens, 4000);
});

test("findPiModelOverride returns correct override for cursor-auto", () => {
  const override = findPiModelOverride("cursor-auto");
  assert.equal(override.reasoning, false);
  assert.deepEqual(override.input, ["text", "image"]);
  assert.equal(override.cost.input, 1.25);
  assert.equal(override.cost.output, 6);
  assert.equal(override.cost.cacheRead, 0.25);
  assert.equal(override.cost.cacheWrite, 1.25);
});

test("findPiModelOverride returns fallback for unknown model ids", () => {
  const override = findPiModelOverride("unknown-future-model");
  assert.equal(override.reasoning, false);
  assert.deepEqual(override.input, ["text", "image"]);
  assert.equal(override.contextWindow, 200000);
  assert.equal(override.maxTokens, 30000);
});

test("findPiModelOverride handles regex patterns correctly", () => {
  const gpt52Fast = findPiModelOverride("gpt-5.2-codex-fast");
  assert.equal(gpt52Fast.reasoning, true);
  
  const gpt53Codex = findPiModelOverride("gpt-5.3-codex");
  assert.equal(gpt53Codex.reasoning, true);
});
