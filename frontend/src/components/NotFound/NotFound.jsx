import React from 'react'
import './NotFound.css'

const NotFound = () => {
    return (
        <div className="NotFound">
            <div className="NotFound__status">404</div>
            <div className="NotFound__message">It seems, such page <br/> doesn't exist :(</div>
        </div>
    )
}

export default NotFound