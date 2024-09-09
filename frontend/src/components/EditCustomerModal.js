import React, { useContext } from 'react'
import { Context } from '../context/SharedState';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';
import moment from 'moment';

export default function EditCustomerModal() {
    const states = useContext(Context)
    const { filteredCustomer, setfilteredCustomer } = useContext(Context)

    const handleInput = (e) => {
        const { name, value } = e.target;
        setfilteredCustomer({
            ...filteredCustomer,
            [name]: value
        })
    }

    
    const handleUpdateCustomer = (e) => {
        e.preventDefault();
        axios.put(states.hostname + '/api/customer/update', filteredCustomer).then((res) => {
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
            {/* Edit Customer Data Modal START */}
            <div className="modal fade" id="editModal" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 d-flex align-items-center">
                                <span className="material-symbols-outlined me-2 fs-1">person</span>
                                {filteredCustomer?.fullname}
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={handleUpdateCustomer}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" name="fullname" value={filteredCustomer?.fullname} onChange={handleInput} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input type="number" className="form-control" name="phone" value={filteredCustomer?.phone} onChange={handleInput} disabled />
                                    <div className="form-text">Phone number cannot be updated.</div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="form-label">Given Amount</label>
                                        <input type="number" className="form-control" placeholder="Rs." name="amount" value={filteredCustomer?.amount} onChange={handleInput} required />
                                    </div>

                                    <div className="col">
                                        <label className="form-label">Interest Rate (per annum)</label>
                                        <input type="number" className="form-control" placeholder="%" name="interest" value={filteredCustomer?.interest} onChange={handleInput} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Given Date</label>
                                    <input type="date" id="date" name="dateGiven" className="form-control" value={moment(filteredCustomer?.dateGiven).format('YYYY-MM-DD')} onChange={handleInput} required />
                                </div>

                                <div className='d-flex justify-content-end mt-5'>
                                    <button type='submit' className="btn btn-danger btn-sm d-flex" data-bs-dismiss="modal"><span className="material-symbols-outlined me-3">manage_accounts</span>Update customer</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Customer Data Modal END*/}
        </>
    )
}
