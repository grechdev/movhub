import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import queryString from 'query-string'

const Pagination = props => {

  const { maxPage, currentPage, limit } = props
  const [pages, setPages] = useState([])

  const history = useHistory()
  const location = useLocation()

  const setPaginationEdges = () => {
    const allPages = []
    
    for (let i = 1; i <= maxPage; i++) {
      allPages.push(i)
    }

      if(currentPage + Math.floor(limit/2) >= maxPage) {
        const expression = allPages.slice(-limit)
        setPages(expression)
      }else if(currentPage - Math.floor(limit/2) <= 0) {
        const expression = allPages.slice(0,limit)
        setPages(expression)
      }else{
        const expression = allPages.slice(currentPage - Math.ceil(limit/2),currentPage + Math.floor(limit/2))
        setPages(expression)
      }
  }

  const handlePrev = () => {
    if(currentPage > 1){
      const query = queryString.parse(location.search)
      query.page = eval(currentPage) - 1
      history.push('/movies?' + queryString.stringify(query))
    }
  }

  const handleNext = () => {
    if(currentPage < maxPage){
      const query = queryString.parse(location.search)
      query.page = eval(currentPage) + 1
      history.push('/movies?' + queryString.stringify(query))
    }
  }

  const handlePage = value => {
    const query = queryString.parse(location.search)
    query.page = value
    history.push('/movies?' + queryString.stringify(query))
  }

  useEffect(() => {
    setPaginationEdges()
  }, [maxPage, currentPage])

  return (
    <div className="pagination">
      <button disabled={currentPage == 1} onClick={() => handlePrev()} className="button arrow">{'<'}</button>
      {
        pages.map(page => {
          return (
            <button
              key={page}
              disabled={page == currentPage}
              className={`button ${page == currentPage && 'selected'}`}
              onClick={e => handlePage(e.target.textContent)}
            >
              {page}
            </button>
          )
        })
      }
      <button disabled={currentPage == maxPage} onClick={() => handleNext()} className="button arrow">{'>'}</button>
    </div>
  )
}

export default Pagination