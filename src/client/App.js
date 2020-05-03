import React, { useState } from 'react';
import moment from 'moment';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/protected">App</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <div className="bg-red-600">
          <Switch>
            <Route path="/protected">
              <Protected />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
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

const handeCheckAuth = async (e) => {
  e.preventDefault();
  let response = await fetch(`/api/server/checkauth`, {
    method: 'GET',
  }).then(function (response) {
    return response.json();
  });
  console.log(response);
};

const handeLogout = async (e) => {
  e.preventDefault();
  let response = await fetch(`/api/server/logout`, {
    method: 'GET',
  }).then(function (response) {
    return response.json();
  });
  console.log(response);
};

function Home() {
  return (
    <div>
      <a href="/api/server/auth/google">Log In with Google</a>
      <button type="button" onClick={(e) => handeCheckAuth(e)}>
        Check Auth
      </button>
      <button type="button" onClick={(e) => handeLogout(e)}>
        Logout
      </button>
    </div>
  );
}

function Protected() {
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
