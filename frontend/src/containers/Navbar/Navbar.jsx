import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './Navbar.css'
import allActions from './../../actions'
import queryString from 'query-string'
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom'

const Navbar = () => {
    const localStorage = window.localStorage

    const location = useLocation()
    const history = useHistory()
    
    const user = useSelector(state => state.user.user)

    const [search, setSearch] = useState(undefined)

    const handleSearchInput = e => {
        setSearch(e.target.value)
    }

    const handleSearch = () => {
        const query = queryString.parse(location.search)
        query.search = search
        history.push('/movies?' + queryString.stringify(query))
    }
    
    const dispatch = useDispatch()

    const handleLink = (link) => {
        const query = queryString.parse(location.search)
        query.sort = link
        query.page = 1
        history.push('/movies?' + queryString.stringify(query))
    }

    useEffect(() => {
        dispatch(allActions.userActions.setUser(user))
    }, [])

    const handleLogout = e => {
        e.preventDefault()
        dispatch(allActions.userActions.setUser({}))
        localStorage.removeItem('accessToken')
    }

    return (
        <div className="Navbar">
            <div className="container">
                <Link to='/movies' className="logo">.movHub</Link>
                <div className="search">
                    <input type="text" onChange={handleSearchInput} className="search__input"/>
                    <button onClick={handleSearch} className="search__button">search</button>
                </div>
                <div className="categories">
                    <span 
                    onClick={() => handleLink('popular')} 
                    className={`categories__item ${history.location.search.indexOf('sort=popular') >= 0 && 'categories__item_selected'}`}
                    >
                        popular
                    </span>
                    <span 
                    onClick={() => handleLink('favorite')} 
                    className={`categories__item ${history.location.search.indexOf('sort=favorite') >= 0 && 'categories__item_selected'}`}
                    >
                        favorite
                    </span>
                </div>
                <Link to='/upload' className="addMovie">+</Link>
                { user.id !== undefined ? 
                    <div className="user">
                        <div className="user__name">{user.username}</div>
                        <div className="user__id">{user.id}</div>
                        <button onClick={handleLogout} className="user__logout">log out</button>
                    </div> :
                    <div className="user">
                        <NavLink to="/login" 
                            className="user__sign user__signin" 
                        >sign in</NavLink>
                        <NavLink to="/register" 
                            className="user__sign user__signup" 
                        >sign up</NavLink>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar