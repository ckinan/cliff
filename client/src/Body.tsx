import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Body: React.FC = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [recordsByHour, setRecordsByHour] = useState([]);

  const fetchTracks = async () => {
    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'GET',
      credentials: 'include',
      headers: headers,
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/tracks`,
      params
    ).then((response) => {
      return response.json();
    });

    setRecords(response.tracks.reverse());
    setSummary(response.summary);

    // Process records by hour
    let report:any = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ];
    let track:any;
    for(track of response.tracksByHour) {
      // console.log(`${moment(track.date).local().hour()+1}-${moment(track.date).local().weekday()-1}`);
      report[moment(track.date).local().hour()][moment(track.date).local().weekday()-1] = track.counter;
    }
    setRecordsByHour(report);
    console.log(report);
  };

  useEffect(() => {
    document.title = 'Main - Cliff';
    fetchTracks();
  }, []);

  const handleAdd = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: number
  ) => {
    e.preventDefault();

    const newRecord = {
      counter: value,
    };

    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: headers,
      body: JSON.stringify(newRecord),
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/track`, params)
      .then((response) => {
        return response.json();
      })
      .then(() => {
        fetchTracks();
      });
  };

  const getRecord = (track: number) => {
    return (
        <>
          {track === 0 ? (
              <td className="border border-gray-400 text-center">{track}</td>
          ) : (track > 0 && track <= 0.2) ? (
              <td className="border border-gray-400 text-center bg-green-200">{track}</td>
          ) : (track > 0.2 && track <= 0.4) ? (
              <td className="border border-gray-400 text-center bg-green-400">{track}</td>
          ) : (
              <td className="border border-gray-400 text-center bg-green-700">{track}</td>
          )}

        </>

    );
  };

  return (
    <div className="my-4">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.2)
            }
          >
            1/5
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.25)
            }
          >
            1/4
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.33)
            }
          >
            1/3
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.5)
            }
          >
            1/2
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 1)
            }
          >
            1
          </button>
        </div>

        <table className="border-collapse border-2 border-gray-500 text-xs mx-auto mt-3">
          <thead>
          <tr>
            <th className="border border-gray-400 w-8 px-4 py-2 bg-gray-200">-</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Mo</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Tu</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">We</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Th</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Fr</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Sa</th>
            <th className="border border-gray-400 w-8 py-2 bg-gray-200">Su</th>
          </tr>
          </thead>
          <tbody>
          {recordsByHour.map((record: any, index: number) => {
            return (
              <tr key={index}>
                <td className="border border-gray-400 text-center bg-gray-200">{index}:00</td>
                {getRecord(record[0])}
                {getRecord(record[1])}
                {getRecord(record[2])}
                {getRecord(record[3])}
                {getRecord(record[4])}
                {getRecord(record[5])}
                {getRecord(record[6])}
              </tr>
            );
          })}
          </tbody>
        </table>

        <h1 className="text-center pt-2">Summary</h1>
        <div className="grid grid-cols-4">
          <div className="border-b px-4 py-2 grid">Count</div>
          <div className="border-b px-4 py-2 grid col-span-3">Date</div>
        </div>
        {summary.map((record: any, index: number) => {
          return (
            <div className="grid grid-cols-4" key={index}>
              <div className="border-b px-4 py-2 grid">{record.counter}</div>
              <div className="border-b px-4 py-2 grid col-span-3">
                {record.date}
              </div>
            </div>
          );
        })}
        <h1 className="text-center pt-2">Details</h1>
        <div className="grid grid-cols-4">
          <div className="border-b px-4 py-2 grid">Count</div>
          <div className="border-b px-4 py-2 grid col-span-3">Date</div>
        </div>
        {records.map((record: any, index) => {
          return (
            <div className="grid grid-cols-4" key={index}>
              <div className="border-b px-4 py-2 grid">{record.counter}</div>
              <div className="border-b px-4 py-2 grid col-span-3">
                {moment(record.createdat).local().format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
