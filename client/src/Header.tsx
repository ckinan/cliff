import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const Header: React.FC = () => {
  const { appDispatch } = useContext(AppContext);

  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    appDispatch({
      type: 'SET_IS_LOADING',
      isLoading: true,
    });

    const headers: HeadersInit = new Headers();
    headers.set('Access-Control-Allow-Credentials', 'true');

    const params: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: headers,
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/logout`,
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
    <>
      <div>CLIFF</div>
      <div className="absolute top-0 right-0 py-2 px-4 hover:bg-gray-100 font-bold">
        <button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleLogout(e)
          }
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Header;
