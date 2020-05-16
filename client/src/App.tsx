import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Switch, Route, useHistory } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'GET',
      credentials: 'include',
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/me`, params)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setIsAuthenticated(json.isAuthenticated);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      history.push(`/app`);
    } else {
      history.push(`/`);
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div>
        <Switch>
          <Route path="/app">
            <Protected
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          </Route>
          <Route path="/">
            <Public />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;

function Public() {
  return <div>Hi! I am public!</div>;
}

interface IAuthProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Header: React.FC<IAuthProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/logout`, params)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setIsAuthenticated(json.isAuthenticated);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: headers,
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, params)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setIsAuthenticated(json.isAuthenticated);
      });
  };

  return (
    <nav>
      <ul>
        <li>
          {isAuthenticated ? (
            <button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleLogout(e)}>
              Logout
            </button>
          ) : (
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <br />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
              </div>
              <div>
                <button type="submit" value="Submit">
                  Login
                </button>
              </div>
            </form>
          )}
        </li>
      </ul>
    </nav>
  );
};

const Protected: React.FC<IAuthProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);

  const fetchTracks = () => {
    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'GET',
      credentials: 'include',
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/tracks`, params)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setRecords(json.tracks.reverse());
        setSummary(json.summary);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTracks();
    }
  }, [isAuthenticated]);

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
      {isAuthenticated ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-5xl text-center">Cliff</h1>
          <div className="text-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.2)}
            >
              1/5
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.25)}
            >
              1/4
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.33)}
            >
              1/3
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAdd(e, 0.5)}
            >
              1/2
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
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
      ) : (
        <a href={`${process.env.REACT_APP_SERVER_URL}`}>Not authenticated</a>
      )}
    </div>
  );
};
