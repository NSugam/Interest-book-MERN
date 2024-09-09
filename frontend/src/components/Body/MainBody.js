import React, { useContext, useEffect, useState } from 'react'
import LeftBody from './LeftBody'
import CenterBody from './CenterBody'
import RightBody from './RightBody'
import { Context } from '../../context/SharedState'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/MainBody.css'
import { Flip, toast } from 'react-toastify'

export default function MainBody() {
    const states = useContext(Context)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        axios.get(states.hostname + '/api/user/profile').then((res) => {
            if (res.data.success) {
                states.setIsAuthenticated(true)

            } else {
                states.setIsAuthenticated(false)
                setLoading(false)
                navigate('/login')
            }
        }).catch((error) => {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
            });
        })
        setLoading(false)
    }, [])

    if(loading) {
        return <> Loading... </>
    }


    return (
        <>

            <div className='appearfromRight'>
                <div className="row" style={{ height: '100vh' }}>

                    <div className="col-sm-2 bg-dark text-light">
                        <LeftBody />
                    </div>

                    <div className="col-sm-6 border-start border-2 scrollable">
                        <CenterBody />
                    </div>

                    <div className="col-sm-4 border-start border-2">
                        <RightBody />
                    </div>

                </div>
            </div>



        </>
    )
}
