import React, { useState, useEffect} from 'react'

import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'

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
    <div className='like'>
      <button className={`button ${props.background ? 'likeBackground' : ''}`} onClick={handleLike}>
        {liked ? 
          <MdFavorite className='icon' style={{ color: '#ff6363' }}/> :
          <MdFavoriteBorder className='icon' style={{ color: '#fff', opacity: 0.4 }}/>
        }
      </button>
      <div className={`count ${props.background ? 'counterBackground' : ''}`} style={{opacity: liked ? 1 : 0.4}}>{props.count}</div>    
    </div>
  )
}

export default Like