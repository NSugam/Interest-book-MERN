import axios from 'axios';
import React, { useContext } from 'react'
import { Bounce, toast } from 'react-toastify';
import { Context } from '../../context/SharedState';
import { useNavigate } from 'react-router-dom';

export default function LeftBody() {
  const states = useContext(Context)
  const navigate = useNavigate()

  const handleLogout = () => {
    axios.get(states.hostname + '/api/user/logout').then((res) => {
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
            states.setIsAuthenticated(false)
            navigate('/login')
        }
    })
}

  return (
    <>
      <div className='container mt-3'>
        <h2 className='text-center'>Interestbook</h2>
        <hr className='w-100'/>
        <a className='btn d-block btn-danger text-start d-flex disabled mb-3 mt-2'><span className="material-symbols-outlined me-2">account_circle</span>Welcome, {states.user.username}</a>
        <a className='btn text-light d-flex m-1'><span className="material-symbols-outlined me-3">tune</span>Settings</a>
        <hr className='w-100'/>
        <a className='btn text-light d-flex m-1'><span className="material-symbols-outlined me-3">group</span>Customers</a>
        <a className='btn text-light d-flex m-1'><span className="material-symbols-outlined me-3">local_shipping</span>Lenders</a>
        <hr className='w-100'/>
        <a className='btn text-danger d-flex m-1' onClick={handleLogout}><span className="material-symbols-outlined me-3">logout</span>LogOut</a>
      </div>
    </>
  )
}
