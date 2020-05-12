import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Switch, Route, useHistory } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setIsAuthenticated(json.isAuthenticated);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
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

function Header({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handeLogout = async (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setIsAuthenticated(json.isAuthenticated);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setIsAuthenticated(json.isAuthenticated);
      });
  };

  return (
    <nav>
      <ul>
        <li>
          {isAuthenticated === true ? (
            <button type="button" onClick={(e) => handeLogout(e)}>
              Logout
            </button>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)}>
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
}

function Protected({ isAuthenticated, setIsAuthenticated }) {
  const [records, setRecords] = useState([]);

  const fetchTracks = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/tracks`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setRecords(json.tracks.reverse());
      });
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchTracks();
    }
  }, [isAuthenticated]);

  const handleAdd = (e, value) => {
    e.preventDefault();
    const newRecord = {
      counter: value,
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/track`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecord),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        fetchTracks();
      });
  };
  return (
    <div>
      {isAuthenticated === true ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-5xl text-center">Cliff</h1>
          <div className="text-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e) => handleAdd(e, 0.33)}
            >
              1/3
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e) => handleAdd(e, 0.5)}
            >
              1/2
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full h-16 w-16 m-3 border-solid border-4 border-green-600"
              onClick={(e) => handleAdd(e, 1)}
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
}
