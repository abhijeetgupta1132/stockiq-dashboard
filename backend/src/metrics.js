function pearsonCorrelation(left, right) {
  if (left.length !== right.length || left.length === 0) return 0;

  const meanLeft = left.reduce((sum, value) => sum + value, 0) / left.length;
  const meanRight = right.reduce((sum, value) => sum + value, 0) / right.length;
  const numerator = left.reduce(
    (sum, value, index) => sum + (value - meanLeft) * (right[index] - meanRight),
    0,
  );
  const denominator = Math.sqrt(
    left.reduce((sum, value) => sum + (value - meanLeft) ** 2, 0) *
      right.reduce((sum, value) => sum + (value - meanRight) ** 2, 0),
  );

  return denominator === 0 ? 0 : +(numerator / denominator).toFixed(4);
}

function correlationLabel(correlation) {
  if (correlation > 0.7) return "Strong positive correlation";
  if (correlation > 0.3) return "Moderate correlation";
  if (correlation > -0.3) return "Weak or no correlation";
  if (correlation > -0.7) return "Moderate negative correlation";
  return "Strong negative correlation";
}

module.exports = { pearsonCorrelation, correlationLabel };
