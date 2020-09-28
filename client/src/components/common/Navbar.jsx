import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom'

import queryString from 'query-string'

import { setUser } from '../../ducks/user';

const Navbar = () => {
  const localStorage = window.localStorage

  const location = useLocation()
  const history = useHistory()
  
  const user = useSelector(state => state.userReducer.user)

  const [search, setSearch] = useState(undefined)

  const handleSearchInput = e => {
    setSearch(e.target.value)
  }

  const handleSearch = () => {
    const query = queryString.parse(location.search)
    query.search = search
    history.push('?' + queryString.stringify(query))
  }
  
  const dispatch = useDispatch()

  const handleLink = (link) => {
    const query = queryString.parse(location.search)
    query.sort = link
    query.page = 1
    history.push('?' + queryString.stringify(query))
  }

  useEffect(() => {
    dispatch(setUser(user))
  }, [])

  const handleLogout = e => {
    e.preventDefault()
    dispatch(setUser({}))
    localStorage.removeItem('accessToken')
  }

  return (
    <div className="navbar">
      <div className="container">
        <Link to='/movies' className="logo">.movHub</Link>
        <div className="search">
          <input type="text" onChange={handleSearchInput} className="input"/>
          <button onClick={handleSearch} className="button">search</button>
        </div>
        <div className="categories">
          <span 
          onClick={() => handleLink('popular')} 
          className={`item ${history.location.search.indexOf('sort=popular') >= 0 && 'selected'}`}
          >
            popular
          </span>
          <span 
          onClick={() => handleLink('favorite')} 
          className={`item ${history.location.search.indexOf('sort=favorite') >= 0 && 'selected'}`}
          >
            favorite
          </span>
        </div>
        <Link to='/upload' className="addMovie">+</Link>
        { user?.id !== undefined ? 
          <div className="user">
            <div className="name">{user.username}</div>
            <div className="id">{user.id}</div>
            <button onClick={handleLogout} className="logout">log out</button>
          </div> :
          <div className="user">
            <NavLink to="/login" 
              className="sign signin" 
            >sign in</NavLink>
            <NavLink to="/register" 
              className="sign signup" 
            >sign up</NavLink>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar