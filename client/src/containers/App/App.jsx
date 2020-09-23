import React, { useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import Gallery from '../Gallery/Gallery'
import Register from '../Register/Register'
import Movie from '../Movie/Movie'
import Login from '../Login/Login'
import Upload from '../Upload/Upload'
import NotFound from '../../components/NotFound/NotFound'
import Loader from '../../components/Loader/Loader'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import allActions from '../../actions'
import axios from 'axios'

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