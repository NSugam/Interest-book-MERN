import React, { useContext, useState } from 'react'
import { Context } from '../../context/SharedState';
import { Bounce, Flip, toast } from 'react-toastify';
import axios from 'axios';
import "../css/login.css"
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const states = useContext(Context)
  const navigate = useNavigate()

  const [userInput, setUserInput] = useState({})
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value
    })
  }

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post(states.hostname + '/api/user/register', userInput).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        navigate('/')

      } else {
        toast.error(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    })
  }
  return (
    <>
      <div className='appearfromRight'>
        <div className="row" style={{ height: '100vh' }}>

          <div className="col-sm-2 fw-bold bg-dark text-light text-center d-flex align-items-center justify-content-center">
            Please Login to Continue
          </div>

          <div className="col-sm-10 background-container d-flex align-items-center justify-content-center">
            <div className='container col-sm-4 p-5 rounded-4 text-light' style={{ background: '#00bcd4' }}>
              <form onSubmit={handleSignup}>
                <h3 className='text-center'>Create new account</h3>
                <hr className='mb-5 w-75 m-auto' />
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" name='username' onChange={handleInput} required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Phone number</label>
                  <input type="number" class="form-control" name='phone' onChange={handleInput} required />
                </div>
                <div class="mb-2">
                  <label class="form-label">Email address</label>
                  <input type="email" class="form-control" name='email' onChange={handleInput} required />
                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-5">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" name='password' onChange={handleInput} required />
                </div>
                <div className='text-end'>
                  <button type='submit' class="btn btn-danger w-100">Register account</button>
                  <Link class="btn btn-outline-dark w-100 mt-3" to="/login">Already have a account</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
