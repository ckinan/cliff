import React, { useState, useEffect } from "react";

function App() {
  const [records, setRecords] = useState([]);

  const handleAddHalf = (e, value) => {
    e.preventDefault();
    const newRecord = {
      count: value,
      createdAt: new Date(),
    };
    setRecords([...records, newRecord]);
  };

  useEffect(() => {
    console.log("Records updated");
  }, [records]);

  return (
    <div>
      <h1>Cliff</h1>
      <div>
        <button onClick={(e) => handleAddHalf(e, 0.5)}>+ 1/2</button>
        <button onClick={(e) => handleAddHalf(e, 1)}>+ 1</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <td>Count</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              return (
                <tr key={index}>
                  <td>{record.count}</td>
                  <td>{record.createdAt.toString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
