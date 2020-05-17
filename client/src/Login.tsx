import React, {useContext, useState, useEffect} from 'react';
import {AppContext} from "./AppContext";

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
            isLoading: true
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

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, params)
          .then(response => {
            return response.json();
          });

        appDispatch({
            type: 'SET_IS_AUTHENTICATED',
            isAuthenticated: response.isAuthenticated
        });
        appDispatch({
            type: 'SET_IS_LOADING',
            isLoading: false
        });
      };

    return (
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleLogin(e)}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" value="Submit">
              Login
            </button>
          </div>
        </form>
    );
};

export default Login;
