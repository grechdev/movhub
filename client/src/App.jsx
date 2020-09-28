import React, { useEffect } from 'react';
import { useDispatch, useSelector, Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import axios from 'axios';

import store from './startup/redux';

import Routes from './Routes'
import Navbar from './components/common/Navbar';

const App = () => {
  return(
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          {/* <Route exact path='/' component={() => <Redirect from='/' to='/movies'/>}/> */}
          <Navbar/>
          <Routes />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
