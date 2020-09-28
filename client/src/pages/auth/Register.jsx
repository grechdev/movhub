import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import axios from 'axios'

import { validator } from '../../scripts/validator'

import { Input } from '../../components/common/Input'

const Register = () => {
  const history = useHistory()

  const [namesCache, setNamesCache] = useState([])

  const [username, setUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(null)
  const [usernameErrors, setUsernameErrors] = useState('')

  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(null)
  const [passwordErrors, setPasswordErrors] = useState('')

  const [repeatPassword, setRepeatPassword] = useState('')
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(null)
  const [repeatPasswordErrors, setRepeatPasswordErrors] = useState('')

  const namesCacheTemp = namesCache

  const handleRegister = e => {
    e.preventDefault()
    if (usernameValid && passwordValid && repeatPasswordValid) {
      axios.post('http://localhost:5000/users/register', {
        username: username,
        password: password
      })
      .then(() => {
        history.push('/login')
      })
      .catch(() => {
        namesCacheTemp.push(username)
        setNamesCache(namesCacheTemp)
        handleUsername(username)
      })
    }
  }
  
  const handleUsername = value => {
    setUsername(value)

    const validationRules = [
      {
        condition: value.length >= 3,
        message: 'Username must be at least 3 characters'
      },
      {
        condition: new RegExp('^[a-zA-Z0-9_]*$').test(value),
        message: 'Only alphanumeric characters are allowed'
      },
      {
        condition: value.length <= 16,
        message: 'Username cannot exceed 16 characters'
      },
      {
        condition: !(namesCache.some(name => name === value)), // if it can't be found
        message: 'Such username is already taken'
      }
    ]

    let userValidation = validator(validationRules)
    setUsernameValid(userValidation.status)
    userValidation.status == false && setUsernameErrors(userValidation.errors)
  }

  const handlePassword = value => {
    setPassword(value)

    const validationRules = [
      {
        condition: value.length >= 5,
        message: 'Password must be at least 5 characters'
      },
      {
        condition: value.length <= 20,
        message: 'Password cannot exceed 20 characters'
      }
    ]

    const passwordValidation = validator(validationRules)

    setPasswordValid(passwordValidation.status)
    passwordValidation.status == false && setPasswordErrors(passwordValidation.errors)
    if(value !== repeatPassword && repeatPasswordValid !== null) {
      setRepeatPasswordValid(false)
    }else if (value === repeatPassword && repeatPassword !==null){
      setRepeatPasswordValid(true)
    }
  }

  const handleRepeatPassword = value => {
    setRepeatPassword(value)

    const validationRules = [
      {
        condition: value === password,
        message: `passwords don't match`
      },
    ]

    const repeatPasswordValidation = validator(validationRules)

    setRepeatPasswordValid(repeatPasswordValidation.status)
    repeatPasswordValidation.status == false && setRepeatPasswordErrors(repeatPasswordValidation.errors)
  }

  return (
    <form className='form'>
      <b className="title">Register</b>
      <Input 
        classList={['registerUsername']}
        conditions={{
          default: usernameValid === null,
          wrong: usernameValid === false,
          correct: usernameValid === true,
          error: usernameValid === false
        }}
        type='text'
        placeholder='username'
        value={username}
        onChange={handleUsername}
        error={usernameErrors}
      />
      <Input
        classList={[]}
        conditions={{
          default: passwordValid === null,
          wrong: passwordValid === false,
          correct: passwordValid === true,
          error: passwordValid === false
        }}
        type='password'
        placeholder='password'
        value={password}
        onChange={handlePassword}
        error={passwordErrors}
      />
      <Input
        classList={[]}
        conditions={{
          default: repeatPasswordValid === null,
          wrong: repeatPasswordValid === false,
          correct: repeatPasswordValid === true && password.length !== 0,
          error: repeatPasswordValid === false
        }}
        type='password'
        placeholder='repeat password'
        value={repeatPassword}
        onChange={handleRepeatPassword}
        error={repeatPasswordErrors}
      />
      <div className="actions">
        <input 
          disabled={!usernameValid || !passwordValid || !repeatPasswordValid} 
          className='submit' 
          type="submit" 
          value="Register"
          onClick={handleRegister}
        />
        <span onClick={() => history.goBack()} className='cancel' type="submit">Cancel</span>
      </div>
    </form>
  )
}

export default Register