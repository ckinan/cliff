import * as React from 'react';

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface IAction extends IState {
  type: 'SET_IS_AUTHENTICATED' | 'SET_IS_LOADING';
}

export const AppContext = React.createContext<any | null>(null);

export const appContextInitialState = {
  isAuthenticated: false,
  isLoading: true,
};

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'SET_IS_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};
