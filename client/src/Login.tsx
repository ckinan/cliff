import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './AppContext';

const Login: React.FC = () => {
  const { appDispatch } = useContext(AppContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    document.title = 'Login - Cliff';
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    appDispatch({
      type: 'SET_IS_LOADING',
      isLoading: true,
    });

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

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/login`,
      params
    ).then((response) => {
      return response.json();
    });

    appDispatch({
      type: 'SET_IS_AUTHENTICATED',
      isAuthenticated: response.isAuthenticated,
    });
    appDispatch({
      type: 'SET_IS_LOADING',
      isLoading: false,
    });
  };

  return (
    <div className="flex flex-col p-2 h-screen">
      <div className="max-w-md m-auto">
        <h1 className="text-5xl text-center">Cliff</h1>
        <p className="text-2xl text-center">Sign in to Cliff</p>

        <div className="border p-5 my-5 rounded">
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleLogin(e)}
          >
            <div>
              <label className="block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded py-2 px-3 w-full focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="py-2">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded py-2 px-3 w-full focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="py-2">
              <button
                type="submit"
                value="Submit"
                className="w-full rounded bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border-solid border-2 border-green-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
