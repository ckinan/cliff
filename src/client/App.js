import React, { useState, useEffect } from 'react';
import moment from 'moment';

function App() {
  const [records, setRecords] = useState(initialData);

  const handleAddHalf = (e, value) => {
    e.preventDefault();
    const newRecord = {
      count: value,
      createdAt: new Date(),
    };
    setRecords([newRecord, ...records]);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-5xl text-center">Cliff</h1>
      <div className="text-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
          onClick={(e) => handleAddHalf(e, 0.5)}
        >
          1/2
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
          onClick={(e) => handleAddHalf(e, 1)}
        >
          1
        </button>
      </div>
      <div className="grid grid-cols-4">
        <div className="border-b px-4 py-2 grid">Count</div>
        <div className="border-b px-4 py-2 grid col-span-3">Date</div>
      </div>
      {records.map((record, index) => {
        return (
          <div className="grid grid-cols-4" key={index}>
            <div className="border-b px-4 py-2 grid">{record.count}</div>
            <div className="border-b px-4 py-2 grid col-span-3">
              {moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;

const initialData = [
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
  {
    count: 1,
    createdAt: new Date(),
  },
];
