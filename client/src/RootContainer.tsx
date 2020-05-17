import React, { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';
import Login from './Login';
import Protected from './Protected';
import { Route, useHistory, Switch } from 'react-router-dom';

const RootContainer: React.FC = () => {
    const { appState, appDispatch } = useContext(AppContext);
    const history = useHistory();

    const fetchUser = async () => {
        appDispatch({
            type: 'SET_IS_LOADING',
            isLoading: true
        });
        const headers: HeadersInit = new Headers();
        headers.set('Access-Control-Allow-Credentials', 'true');

        const params: RequestInit = {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/me`, params)
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

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (appState.isAuthenticated) {
            history.replace('/app');
        } else {
            history.replace('/');
        }
    }, [appState.isAuthenticated]);

    return (
        <>
            {
                appState.isLoading ? (
                    <>Loading...</>
                ): (
                    <Switch>
                        <Route exact path="/">
                            <Login />
                        </Route>
                        <Route path="/app">
                            <Protected />
                        </Route>
                    </Switch>
                )
            }
        </>
    );
};

export default RootContainer;
