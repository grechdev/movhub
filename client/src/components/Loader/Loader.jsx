import React from 'react'
import './Loader.css'

const Loader = () => {
    return (
        <div className="Loader">
            <div className="Loader__title">Loading</div>
            <div className="Loader__circle Loader__circle_big"></div>
            <div className="Loader__circle Loader__circle_medium"></div>
            <div className="Loader__circle Loader__circle_small"></div>
        </div>
    )
}

export default Loader