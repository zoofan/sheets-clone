"use client";

import React, {useState} from "react";

const Spreadsheet = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(6);
  const [data, setData] = useState({});

  const generateHeaders = (count) =>
    Array.from({length: count}, (_, i) => String.fromCharCode(65 + i));

  const handleInputChange = (row, col, value) => {
    setData((prevData) => ({
      ...prevData,
      [`${row}-${col}`]: value,
    }));
  };

  const handleInputComplete = (row, col, value) => {
    if (value.startsWith("=")) {
      const result = handleExpression(row, col, value);
      setData((prevData) => ({
        ...prevData,
        [`${row}-${col}`]: result,
      }));
    }
  };

  const handleExpression = (row, col, equation) => {
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
          `${rightMatch[2] - 1}-${
            rightMatch[1].toUpperCase().charCodeAt(0) - 65
          }`
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

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Zingage Sheets</h1>
      </header>

      {/* Controls */}
      <div className="flex gap-4 justify-center mb-6">
        <label className="flex items-center space-x-2">
          <span className="font-medium text-lg">Rows:</span>
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-24 p-3 border rounded-md text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span className="font-medium text-lg">Columns:</span>
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-24 p-3 border rounded-md text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Spreadsheet */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="w-16 border border-gray-300 bg-blue-100 text-lg font-bold text-blue-700"></th>
              {generateHeaders(cols).map((header, index) => (
                <th
                  key={index}
                  className="w-16 border border-gray-300 bg-blue-100 text-lg font-bold text-blue-700 text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length: rows}).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-16 border border-gray-300 bg-gray-100 text-lg font-bold text-gray-700 text-center">
                  {rowIndex + 1}
                </td>
                {Array.from({length: cols}).map((_, colIndex) => (
                  <td key={colIndex} className="w-16 border border-gray-300">
                    <input
                      type="text"
                      value={data[`${rowIndex}-${colIndex}`] || ""}
                      onChange={(e) =>
                        handleInputChange(rowIndex, colIndex, e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputComplete(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full p-3 text-base font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;
