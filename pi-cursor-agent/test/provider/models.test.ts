import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getCachedPiModels } from "../../src/provider/models.js";

function withMockedCacheJson(cacheJson: string, fn: () => void) {
  const originalExistsSync = fs.existsSync;
  const originalReadFileSync = fs.readFileSync;

  fs.existsSync = (() => true) as unknown as typeof fs.existsSync;
  fs.readFileSync = (() => cacheJson) as unknown as typeof fs.readFileSync;

  try {
    fn();
  } finally {
    fs.existsSync = originalExistsSync;
    fs.readFileSync = originalReadFileSync;
  }
}

test("getCachedPiModels maps composer-2 and cursor-auto ids", () => {
  const cacheJson = JSON.stringify({
    lastUpdatedAt: new Date().toISOString(),
    models: [
      { modelId: "composer-2", displayName: "Composer 2" },
      { modelId: "default", displayName: "Auto" },
    ],
  });

  withMockedCacheJson(cacheJson, () => {
    const models = getCachedPiModels();
    assert.equal(models.length, 2);

    const composer2 = models.find((m) => m.id === "composer-2");
    assert.ok(composer2);
    assert.equal(composer2.cost.input, 0.5);
    assert.equal(composer2.cost.output, 2.5);
    assert.equal(composer2.reasoning, true);

    const auto = models.find((m) => m.id === "cursor-auto");
    assert.ok(auto);
    assert.equal(auto.cost.input, 1.25);
    assert.equal(auto.cost.output, 6);
    assert.equal(auto.reasoning, false);
  });
});

test("getCachedPiModels filters out mapped variant ids", () => {
  const cacheJson = JSON.stringify({
    lastUpdatedAt: new Date().toISOString(),
    models: [
      { modelId: "claude-4.5-sonnet", displayName: "Claude 4.5 Sonnet" },
      {
        modelId: "claude-4.5-sonnet-thinking",
        displayName: "Claude 4.5 Sonnet Thinking",
      },
    ],
  });

  withMockedCacheJson(cacheJson, () => {
    const models = getCachedPiModels();
    assert.equal(models.length, 1);
    assert.equal(models[0]?.id, "claude-sonnet-4-5");
  });
});

test("getCachedPiModels keeps unknown ids with fallback override", () => {
  const cacheJson = JSON.stringify({
    lastUpdatedAt: new Date().toISOString(),
    models: [{ modelId: "future-cursor-model", displayName: "Future Model" }],
  });

  withMockedCacheJson(cacheJson, () => {
    const models = getCachedPiModels();
    assert.equal(models.length, 1);
    assert.equal(models[0]?.id, "future-cursor-model");
    assert.equal(models[0]?.reasoning, false);
    assert.equal(models[0]?.cost.input, 1.25);
    assert.equal(models[0]?.cost.output, 6);
  });
});
