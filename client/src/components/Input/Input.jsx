import React, {useState} from 'react'
import './Input.css'

export const Input = props => {

    const borderStyle = {
        border: props.conditions.default && '' ||
                props.conditions.wrong && '2px solid #ff6363' || 
                props.conditions.correct === true && '2px solid #63ff63'
    }

    return (
        <div className="Input">
            {props.type !== 'textarea' ? <input
                className={`Input__field ${props.classList.join(' ')}`}
                spellCheck={false}
                style={borderStyle}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            /> :
            <textarea 
                className={`Input__field Input__textarea ${props.classList.join(' ')}`}
                spellCheck={false}
                style={borderStyle}
                placeholder={props.placeholder}
                onChange={e => props.onChange(e.target.value)}
                value={props.value}
            >
            </textarea>
            }
            <div className={`Input__error ${props.conditions.error ? (props.appear == 'bottom' ? 'showErrorBottom': 'showErrorRight') : 'hideError'}`}>{props.error}</div>
        </div>
    )
}

export const File = props => {
    const [filename, setFilename] = useState('')
    const handleChange = e => {
        const file = e.target.files[0]
        props.file(file)
        setFilename(file.name)
    }

    const borderStyle = {
        border: props.conditions.default && '' ||
                props.conditions.wrong && '2px solid #ff6363' || 
                props.conditions.correct === true && '2px solid #63ff63'
    }

    const textStyle = {
        color: props.conditions.default && '' ||
                props.conditions.wrong && '#ff6363' || 
                props.conditions.correct === true && '#63ff63'
    }

    return (
        <div className="File">
            <input id="fileInput" onChange={handleChange} style={{display: 'none'}} type="file"/>
            <div className="File__wrapper">
                <label htmlFor="fileInput"><span style={{...borderStyle, ...textStyle}} className="File__input">Select file</span></label>
                <div style={textStyle} className="File__name">{filename}</div>
                <div className={`Input__error ${props.conditions.error ? 'showError' : 'hideError'}`}>{props.error}</div>
            </div>
        </div>
    )
}
