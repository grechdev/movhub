import React, { useEffetc, useState, useEffect} from 'react'
import './Like.css'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'

const Like = props => {

    const [liked, setLiked] = useState(false)

    const handleLike = () => {
        setLiked(!liked)
        props.onLike(!(props.isLiked))
    }

    useEffect(() => {
        setLiked(props.isLiked)
    }, [props.isLiked])

    return (
        <div className='Like'>
            <button className={`Like__button ${props.background ? 'likeBackground' : ''}`} onClick={handleLike}>
                {liked ? 
                    <FavoriteIcon className='Like__icon' style={{ color: '#ff6363' }}/> :
                    <FavoriteBorderIcon className='Like__icon' style={{ color: '#fff', opacity: 0.4 }}/>
                }
            </button>
            <div className={`Like__count ${props.background ? 'counterBackground' : ''}`} style={{opacity: liked ? 1 : 0.4}}>{props.count}</div>    
        </div>
    )
}

export default Like