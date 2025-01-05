"use client";

import React, {useState} from "react";
import {handleExpression} from "./utils"; // Extracted utility function

// Props types for SpreadsheetControls
interface SpreadsheetControlsProps {
  rows: number;
  cols: number;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
}

// Props types for SpreadsheetTable
interface SpreadsheetTableProps {
  rows: number;
  cols: number;
  data: Record<string, string>;
  handleInputChange: (row: number, col: number, value: string) => void;
  handleInputComplete: (row: number, col: number, value: string) => void;
}

const SpreadsheetHeader: React.FC = () => (
  <header className="text-center mb-6">
    <h1 className="text-3xl font-bold text-orange-700">Zingage Sheets</h1>
  </header>
);

const SpreadsheetControls: React.FC<SpreadsheetControlsProps> = ({
  rows,
  cols,
  setRows,
  setCols,
}) => (
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
);

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({
  rows,
  cols,
  data,
  handleInputChange,
  handleInputComplete,
}) => {
  const generateHeaders = (count: number): string[] =>
    Array.from({length: count}, (_, i) => String.fromCharCode(65 + i));

  return (
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
  );
};

const Spreadsheet: React.FC = () => {
  const [rows, setRows] = useState<number>(6);
  const [cols, setCols] = useState<number>(6);
  const [data, setData] = useState<Record<string, string>>({});

  const handleInputChange = (row: number, col: number, value: string): void => {
    setData((prevData) => ({
      ...prevData,
      [`${row}-${col}`]: value,
    }));
  };

  const handleInputComplete = (
    row: number,
    col: number,
    value: string
  ): void => {
    if (value.startsWith("=")) {
      const result = handleExpression(data, row, col, value);
      setData((prevData) => ({
        ...prevData,
        [`${row}-${col}`]: result,
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <SpreadsheetHeader />
      <SpreadsheetControls
        rows={rows}
        cols={cols}
        setRows={setRows}
        setCols={setCols}
      />
      <SpreadsheetTable
        rows={rows}
        cols={cols}
        data={data}
        handleInputChange={handleInputChange}
        handleInputComplete={handleInputComplete}
      />
    </div>
  );
};

export default Spreadsheet;