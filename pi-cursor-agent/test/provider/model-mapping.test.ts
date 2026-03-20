import assert from "node:assert/strict";
import test from "node:test";
import { toCanonicalId, toCursorId } from "../../src/provider/model-mapping.js";

test("toCanonicalId returns canonical id for known default cursor id", () => {
  assert.equal(toCanonicalId("composer-1"), "composer-1");
  assert.equal(toCanonicalId("composer-1.5"), "composer-1.5");
  assert.equal(toCanonicalId("composer-2"), "composer-2");
  assert.equal(toCanonicalId("default"), "cursor-auto");
});

test("toCanonicalId returns null for mapped variant cursor ids", () => {
  assert.equal(toCanonicalId("claude-4.5-sonnet-thinking"), null);
  assert.equal(toCanonicalId("gpt-5.1-low"), null);
  assert.equal(toCanonicalId("gpt-5.2-codex-high"), null);
});

test("toCanonicalId returns unknown cursor id as-is", () => {
  assert.equal(toCanonicalId("unknown-model-id"), "unknown-model-id");
  assert.equal(toCanonicalId("future-model-v2"), "future-model-v2");
});

test("toCursorId resolves canonical composer ids to cursor ids", () => {
  assert.equal(toCursorId("composer-1"), "composer-1");
  assert.equal(toCursorId("composer-1.5"), "composer-1.5");
  assert.equal(toCursorId("composer-2"), "composer-2");
});

test("toCursorId resolves cursor-auto to default", () => {
  assert.equal(toCursorId("cursor-auto"), "default");
});

test("toCursorId returns unknown canonical id as-is", () => {
  assert.equal(toCursorId("unknown-model-id"), "unknown-model-id");
  assert.equal(toCursorId("future-model-v2"), "future-model-v2");
});

test("toCursorId applies thinking level variants for mapped models", () => {
  assert.equal(toCursorId("claude-sonnet-4-5"), "claude-4.5-sonnet");
  assert.equal(toCursorId("claude-sonnet-4-5", "medium"), "claude-4.5-sonnet-thinking");
  assert.equal(toCursorId("gpt-5.1", "high"), "gpt-5.1-high");
});

test("toCursorId ignores thinking level for models without variants", () => {
  assert.equal(toCursorId("composer-1", "high"), "composer-1");
  assert.equal(toCursorId("composer-2", "medium"), "composer-2");
  assert.equal(toCursorId("cursor-auto", "high"), "default");
});

test("toCanonicalId and toCursorId are consistent for composer-2", () => {
  const canonical = toCanonicalId("composer-2");
  assert.equal(canonical, "composer-2");
  assert.equal(toCursorId(canonical!), "composer-2");
});

test("toCanonicalId and toCursorId are consistent for cursor-auto", () => {
  const canonical = toCanonicalId("default");
  assert.equal(canonical, "cursor-auto");
  assert.equal(toCursorId(canonical!), "default");
});
