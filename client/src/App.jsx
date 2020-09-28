import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BrowserRouter, Route, Redirect } from 'react-router-dom'

import axios from 'axios'

import allActions from './actions'

import Routes from './Routes'
import Navbar from './components/common/Navbar'
import Loader from './components/common/Loader'

const App = () => {
  const localStorage = window.localStorage

  const loaderVisible = useSelector(state => state.loader.loader)

  const dispatch = useDispatch()

  const fetchUser = () => {
    if (localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== null) {
      axios.get(`http://localhost:5000/users/token/${localStorage.getItem('accessToken')}`)
        .then(res => {
          if (res.data.status) {
            dispatch(allActions.userActions.setUser(res.data.result))
          }
        })
        .catch(err => {
          alert(err.message);
        });
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return(
    <BrowserRouter>
      <div className="app">
        {/* <Route exact path='/' component={() => <Redirect from='/' to='/movies'/>}/> */}
        <Navbar/>
        <Routes />
        {loaderVisible && <Loader />}
      </div>
    </BrowserRouter>
  )
}

export default App;
