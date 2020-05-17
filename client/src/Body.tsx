import React, {useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {AppContext} from "./AppContext";

const Body: React.FC = () => {
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState([]);
    const { appDispatch } = useContext(AppContext);

    const fetchTracks = async () => {
        const headers: HeadersInit = new Headers();
        headers.set('Access-Control-Allow-Credentials', 'true');

        const params: RequestInit = {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tracks`, params)
          .then(response => {
            return response.json();
          });

        setRecords(response.tracks.reverse());
        setSummary(response.summary);
      };

    useEffect(() => {
        document.title = 'Main - Cliff';
        fetchTracks();
    }, []);

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: number) => {
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
          .then(response => {
            return response.json();
          })
          .then(() => {
            fetchTracks();
          });
     };

    return (
        <div>
            <div className="max-w-md mx-auto">
              <h1 className="text-5xl text-center">Cliff</h1>
              <div className="text-center">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.2)}
                >
                  1/5
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.25)}
                >
                  1/4
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.33)}
                >
                  1/3
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.5)}
                >
                  1/2
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-2 border-green-600"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 1)}
                >
                  1
                </button>
              </div>
              <h1 className="text-2xl text-center pt-2">Summary</h1>
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
              <h1 className="text-2xl text-center pt-2">Details</h1>
              <div className="grid grid-cols-4">
                <div className="border-b px-4 py-2 grid">Count</div>
                <div className="border-b px-4 py-2 grid col-span-3">Date</div>
              </div>
              {records.map((record: any, index) => {
                return (
                  <div className="grid grid-cols-4" key={index}>
                    <div className="border-b px-4 py-2 grid">{record.counter}</div>
                    <div className="border-b px-4 py-2 grid col-span-3">
                      {moment(record.createdat)
                        .local()
                        .format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                );
              })}
            </div>

        </div>
    );
};

export default Body;
