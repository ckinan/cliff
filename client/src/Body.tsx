import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Body: React.FC = () => {
  const [tracks, setTracks] = useState<Array<any>>([]);
  const [report, setReport] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weekSum, setWeekSum] = useState(0);
  const [isThisWeek, setIsThisWeek] = useState(false);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                            startDate: string,
                            endDate: string) => {
    e.preventDefault();
    fetchTracks(startDate, endDate);
  };

  const fetchTracks = async (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);

    const startDateComp = moment(startDate);
    const endDateComp = moment(endDate);
    const now = moment();

    setIsThisWeek(now.isSameOrAfter(startDateComp, "day") && now.isSameOrBefore(endDateComp, "day"));

    console.log(`${startDate}-${endDate}`);

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
    let tmpReportWeek:number = 0;

    for(let track of response.tracks) {
      tmpReport[moment(track.date).utc(false).hour()][moment(track.date).utc(false).isoWeekday()-1] = track.counter;
      tmpReportSummary[moment(track.date).utc(false).isoWeekday()-1] += track.counter;
      tmpReportWeek += track.counter;
    }

    setTracks(response.tracks);
    setReport(tmpReport);
    setReportSummary(tmpReportSummary);
    setWeekSum(Math.round(tmpReportWeek * 100) / 100);
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

  const getRecord = (record: Array<number>, day: number, hour: number) => {
    const track = record[day];
    const currentDay = moment().isoWeekday() - 1;
    const currentHour = moment().hours();
    return (
        <>
          {(currentDay === day && currentHour === hour && isThisWeek) ? (
              <td className="border border-gray-400 text-center bg-yellow-400">{track}</td>
          ) : track === 0 ? (
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
      <div className="flex flex-row max-w-md mx-auto">

        <div className="flex flex-col text-center mx-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full h-16 w-16 my-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleAdd(e, 0.1)
            }
          >
            1/10
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full h-16 w-16 my-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.2)
            }
          >
            1/5
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full h-16 w-16 my-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 0.5)
            }
          >
            1/2
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full h-16 w-16 my-3 border-solid border-2 border-green-600"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleAdd(e, 1)
            }
          >
            1
          </button>
        </div>

        <table className="border-collapse border-2 border-gray-500 text-xs mt-3 mb-3 rounded-md">
          <thead>
            <tr>
              <th colSpan={8} className="border border-gray-400 px-4 bg-gray-200">{
                `From: ${startDate} To: ${endDate}`
              }</th>
            </tr>
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
                    {getRecord(record, 0, index)}
                    {getRecord(record, 1, index)}
                    {getRecord(record, 2, index)}
                    {getRecord(record, 3, index)}
                    {getRecord(record, 4, index)}
                    {getRecord(record, 5, index)}
                    {getRecord(record, 6, index)}
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

          <tfoot>
            <tr>
              <td colSpan={8}>
                <div className="flex flex-row items-stretch justify-between text-center">
                  <button
                      className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 border-solid border-2 border-green-600 text-xs mr-1 rounded-md"
                      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                          handlePagination(
                              e,
                              moment(startDate).subtract(1, 'weeks').format('YYYY-MM-DD'),
                              moment(endDate).subtract(1, 'weeks').format('YYYY-MM-DD')
                          )
                      }
                  >
                    {"<"}
                  </button>
                  <button
                      className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 border-solid border-2 border-green-600 text-xs ml-1 rounded-md"
                      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                          handlePagination(
                              e,
                              moment(startDate).add(1, 'weeks').format('YYYY-MM-DD'),
                              moment(endDate).add(1, 'weeks').format('YYYY-MM-DD')
                          )
                      }
                  >
                    {">"}
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex flex-col text-center my-3 leading-none w-16 ml-2">
          <div className="text-3xl">{weekSum}</div>
          <div className="text-sm text-gray-700">Total</div>
        </div>

      </div>
    </div>
  );
};

export default Body;
