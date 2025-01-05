export const handleExpression = (data, row, col, equation) => {
  // Remove initial '='
  const expression = equation.slice(1);
  // Split expression by operator
  let [left, operator, right] = expression.split(/([+/*-])/);

  // Check if left and right are cell references
  const cellRegex = /([A-Z])(\d+)/i;
  const leftMatch = left.match(cellRegex);
  const rightMatch = right?.match(cellRegex);

  if (leftMatch) {
    left =
      data[
        `${leftMatch[2] - 1}-${leftMatch[1].toUpperCase().charCodeAt(0) - 65}`
      ];

    if (!operator || !rightMatch) {
      return left;
    }
  }
  if (rightMatch) {
    right =
      data[
        `${rightMatch[2] - 1}-${rightMatch[1].toUpperCase().charCodeAt(0) - 65}`
      ];
  }

  // Convert left and right to numbers
  const leftValue = parseFloat(left);
  const rightValue = parseFloat(right);

  // Check if both leftValue and rightValue are finite numbers
  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
    return "Error";
  }

  // Evaluate expression
  let result;
  switch (operator) {
    case "+":
      result = leftValue + rightValue;
      break;
    case "-":
      result = leftValue - rightValue;
      break;
    case "*":
      result = leftValue * rightValue;
      break;
    case "/":
      result =
        rightValue !== 0 ? leftValue / rightValue : "Error: Division by zero";
      break;
    default:
      result = "Error";
  }

  return Number.isFinite(result) ? result : "Error";
};
