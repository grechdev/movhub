import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../../components/Card/Card'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import NotFound from '../../components/NotFound/NotFound'
import Pagination from '../../components/Pagination/Pagination'
import allActions from '../../actions'
import LazyLoad from 'vanilla-lazyload'

const Gallery = () => {

  var lazyLoadInstance = new LazyLoad({
    elements_selector: '.Card__photo'
  })

  const localStorage = window.localStorage

  const dispatch = useDispatch()

  const location = useLocation()
  const history = useHistory()

  const user = useSelector(state => state.user.user)

  const [movies, setMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const fetchMovies = () => {
    const accessToken = localStorage.getItem('accessToken')
    dispatch(allActions.loaderActions.setLoader(true))
    axios({
      method: 'GET',
      url: 'http://localhost:5000/movies',
      params: queryString.parse(location.search),
      headers: {
        accessToken: accessToken
      }

    })
    .then(res => {
      setMovies(res.data.result)
      setCurrentPage(res.data.page)
      setMaxPage(res.data.maxPage)
      dispatch(allActions.loaderActions.setLoader(false))
    })
    .catch(err => {
      if (err.message === 'Network Error') {

      }
    })
  }

  useEffect(() => {
    fetchMovies()
  }, [history.location.search])

  useEffect(() => {
    setMovies(movies)
    setMaxPage(maxPage)
  }, [movies])

  const likeHandler = (id) => {
    axios.patch(`http://localhost:5000/movies/like/${id}`, {
      token: localStorage.getItem('accessToken')
    })
  }

  const clickHandler = (e, id) => {
    const target = e.target
    if(target.closest('.button') === null) {
      history.push(`/movies/post/${id}`)
    }
  }

  return movies.length > 0 ? (
    <div className="gallery">
      {
        movies.map(item => (
          <Card 
            key={item.id} 
            liked={item.liked.includes(user.id)}
            id={item.id} 
            title={item.title} 
            path={item.path} 
            owner={item.owner} 
            likes={item.likesCount}
            onLike={likeHandler}
            onClick={clickHandler}
            date={item.date}
          />
        ))
      }
      <Pagination maxPage={maxPage} limit={5} currentPage={currentPage}/>
      {lazyLoadInstance.update()}
    </div>
  ): (<NotFound />)
}

export default Gallery