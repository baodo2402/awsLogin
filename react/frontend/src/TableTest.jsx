import React, { useState } from 'react';
import './TableTestStyle.css'
function TableTest() {
  const [headers, setHeaders] = useState(['Header 1', 'Header 2']);
  const [data, setData] = useState([{ col1: 'Data 1', col2: 'Data 2' }]);

  const addRow = () => {
    setData([...data, {}]);
  };

  const addColumn = () => {
    setHeaders([...headers, `Header ${headers.length + 1}`]);
    setData(data.map(row => ({ ...row, [`col${headers.length + 1}`]: '' })));
  };

  const editCell = (rowIndex, colName, value) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex][colName] = value;
      return newData;
    });
  };

  const editHeader = (index, newName) => {
    setHeaders(prevHeaders => {
      const newHeaders = [...prevHeaders];
      newHeaders[index] = newName;
      return newHeaders;
    });
  };

  return (
    <div>
      <button onClick={addRow}>Add Row</button>
      <button onClick={addColumn}>Add Column</button>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>
                <input
                id='table-input'
                  type="text"
                  value={header}
                  onChange={e => editHeader(index, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  <input
                    id='table-input'
                    type="text"
                    value={row[`col${colIndex + 1}`] || ''}
                    onChange={e =>
                      editCell(rowIndex, `col${colIndex + 1}`, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableTest;
