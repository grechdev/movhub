import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import axios from 'axios'

import allActions from './actions'

import Navbar from './components/common/Navbar'
import Loader from './components/common/Loader'
import Gallery from './pages/Gallery'
import Register from './pages/auth/Register'
import Movie from './pages/Movie'
import Login from './pages/auth/Login'
import Upload from './pages/Upload'
import NotFound from './pages/NotFound'

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
        <Route exact path='/' component={() => <Redirect from='/' to='/movies'/>}/>

        <Navbar/>
        <Switch>
          <Route strict exact path='/movies/search' component={() => <div>here's search</div>}/>
          <Route strict exact path='/movies/post/:movieId' component={Movie}/>
          <Route exact path='/movies' component={Gallery} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/upload' component={Upload} />
          <Route path='*' component={NotFound} />
        </Switch>
        {loaderVisible && <Loader />}
      </div>
    </BrowserRouter>
  )
}

export default App