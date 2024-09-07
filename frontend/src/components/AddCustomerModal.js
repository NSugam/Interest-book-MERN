import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../context/SharedState';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';

export default function AddCustomerModal() {
    const states = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({})
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    const handleAddCustomer = (e) => {
        e.preventDefault();
        axios.post(states.hostname + '/api/customer/add', userInput).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message, {
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
            }
        })
    }

    return (
        <>
            <div className="modal fade" id="exampleModal"
                aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-theme={`${states.mode === 'dark' ? 'dark' : 'light'}`}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflowY: 'auto', minHeight: '55vh' }}>
                        <div className="modal-header">
                            <h1 className={`modal-title fs-5 text-${states.mode === 'dark' ? 'light' : 'dark'}`} id="exampleModalLabel">Add new Customer</h1>

                            <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>

                        </div>
                        <div className="modal-body p-5">
                            <form onSubmit={handleAddCustomer}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" name="fullname" value={userInput.fullname} onChange={handleInput} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input type="number" className="form-control" name="phone" onChange={handleInput} required />
                                    <div className="form-text">Data will be confidential.</div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">Given Amount</label>
                                        <input type="number" className="form-control" placeholder="Rs." name="amount" onChange={handleInput} required />
                                    </div>

                                    <div className="col">
                                        <label className="form-label">Interest Rate (per annum)</label>
                                        <input type="number" className="form-control" placeholder="%" name="interest" onChange={handleInput} required />
                                    </div>
                                    <div className="col">
                                        <label className="form-label">Date</label>
                                        <input type="date" id="date" name="dateGiven" className="form-control" onChange={handleInput} required />
                                    </div>
                                </div>

                                <div className='d-flex justify-content-end mt-5'>
                                    <button className="btn btn-primary btn-sm d-flex" data-bs-dismiss="modal"><span className="material-symbols-outlined me-3">person_add</span>Add customer</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
