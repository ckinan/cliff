import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Body: React.FC = () => {
  const [tracks, setTracks] = useState<Array<any>>([]);
  const [report, setReport] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                            startDate: string,
                            endDate: string) => {
    e.preventDefault();
    fetchTracks(startDate, endDate);
  };

  const fetchTracks = async (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);

    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'GET',
      credentials: 'include',
      headers: headers,
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/tracks?startDate=${startDate}&endDate=${endDate}`,
      params
    ).then((response) => {
      return response.json();
    });

    // Process records by hour
    let tmpReport:any = [
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
    let tmpReportSummary:any = [0,0,0,0,0,0,0];

    for(let track of response.tracks) {
      tmpReport[moment(track.date).local().hour()][moment(track.date).local().isoWeekday()-1] = track.counter;
      tmpReportSummary[moment(track.date).local().isoWeekday()-1] += track.counter;
    }

    setTracks(response.tracks);
    setReport(tmpReport);
    setReportSummary(tmpReportSummary);
  };

  useEffect(() => {
    document.title = 'Main - Cliff';
    fetchTracks(
        moment().isoWeekday(1).format('YYYY-MM-DD'),
        moment().isoWeekday(7).format('YYYY-MM-DD')
    );
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
        fetchTracks(startDate, endDate);
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
    <div>
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

        <div className="text-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-3 border-solid border-2 border-green-600 text-xs"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handlePagination(
                  e,
                  moment(startDate).subtract(1, 'weeks').format('YYYY-MM-DD'),
                  moment(endDate).subtract(1, 'weeks').format('YYYY-MM-DD')
              )
            }
          >
            Previous Week
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-3 border-solid border-2 border-green-600 text-xs"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handlePagination(
                  e,
                  moment(startDate).add(1, 'weeks').format('YYYY-MM-DD'),
                  moment(endDate).add(1, 'weeks').format('YYYY-MM-DD')
              )
            }
          >
            Next Week
          </button>
        </div>

        <div className="text-center">
          {
            `From: ${startDate} To: ${endDate}`
          }
        </div>

        <table className="border-collapse border-2 border-gray-500 text-xs mx-auto mt-3 mb-3">
          <thead>
          <tr>
            <th className="border border-gray-400 w-8 px-4 bg-gray-200">-</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Mo</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Tu</th>
            <th className="border border-gray-400 w-8 bg-gray-200">We</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Th</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Fr</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Sa</th>
            <th className="border border-gray-400 w-8 bg-gray-200">Su</th>
          </tr>
          </thead>
          <tbody>
          {report.map((record: any, index: number) => {
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
          <tr>
            <td className="border border-gray-400 text-center bg-gray-200">-</td>
            {reportSummary.map((record: any, index: number) => {
              return (
                  <td className="border border-gray-400 text-center bg-gray-200" key={index}>{record.toFixed(2)}</td>
              );
            })}
          </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Body;
