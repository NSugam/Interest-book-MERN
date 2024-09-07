import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/SharedState';
import { Flip, toast } from 'react-toastify';
import axios from 'axios';
import "../css/login.css"
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
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

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(states.hostname + '/api/user/login', userInput).then(async (res) => {
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        });
        navigate('/')
        setUserInput({})

      } else {
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
        });
        console.log(res.data)
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
                <form onSubmit={handleLogin}>
                  <h3 className='text-center'>Welcome back!</h3>
                  <hr className='mb-5 w-75 m-auto' />
                  <div class="mb-3">
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control" name="email" onChange={handleInput} required />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" name="password" onChange={handleInput} required />
                  </div>

                  <div className='d-flex justify-content-end mt-5'>
                    {/* <Link class="btn btn-dark link btn-sm d-flex me-3" to="/signup">Create new account</Link> */}
                    <button class="btn btn-danger btn-sm d-flex">Login<span class="material-symbols-outlined ms-1">login</span></button>
                  </div>
                </form>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
