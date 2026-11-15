const test = require("node:test");
const assert = require("node:assert/strict");
const { pearsonCorrelation, correlationLabel } = require("../src/metrics");

test("calculates perfect positive correlation", () => {
  assert.equal(pearsonCorrelation([1, 2, 3], [2, 4, 6]), 1);
});

test("calculates perfect negative correlation", () => {
  assert.equal(pearsonCorrelation([1, 2, 3], [6, 4, 2]), -1);
});

test("returns zero for empty or mismatched series", () => {
  assert.equal(pearsonCorrelation([], []), 0);
  assert.equal(pearsonCorrelation([1], [1, 2]), 0);
});

test("labels correlation strength", () => {
  assert.equal(correlationLabel(0.8), "Strong positive correlation");
  assert.equal(correlationLabel(-0.8), "Strong negative correlation");
  assert.equal(correlationLabel(0), "Weak or no correlation");
});
