import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Gallery from './pages/Gallery'
import Register from './pages/auth/Register'
import Movie from './pages/Movie'
import Login from './pages/auth/Login'
import Upload from './pages/Upload'
import NotFound from './pages/NotFound'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Gallery} />
    <Route strict exact path='/movies/search' component={() => <div>here's search</div>}/>
    <Route strict exact path='/movies/post/:movieId' component={Movie}/>
    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
    <Route path='/upload' component={Upload} />
    <Route path='*' component={NotFound} />
  </Switch>
);

export default Routes;
