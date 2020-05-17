import React, { useReducer } from 'react';
import { AppContext, appContextInitialState, AppReducer } from './AppContext';
import { BrowserRouter } from 'react-router-dom';
import RootContainer from './RootContainer';

const App: React.FC = () => {
  const [appState, appDispatch] = useReducer(AppReducer, appContextInitialState);

  return (
      <BrowserRouter>
        <AppContext.Provider value={{appState, appDispatch}}>
          <RootContainer/>
        </AppContext.Provider>
      </BrowserRouter>
  );
};

export default App;
