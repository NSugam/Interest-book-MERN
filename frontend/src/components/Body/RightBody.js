import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Context } from '../../context/SharedState';
import moment from 'moment';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';

export default function RightBody() {
  const states = useContext(Context)
  const location = useLocation();
  const [userInput, setUserInput] = useState({})
  const [filteredCustomer, setfilteredCustomer] = useState()

  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('id');
  window.history.replaceState({}, document.title, window.location.pathname); //removing parameter to clean the URL

  useEffect(() => {
    const getCustomerByID = () => {
      const FilteredCustomer = states.customers.find((customer) => customer._id === customerId);
      if (FilteredCustomer) {
        setfilteredCustomer(FilteredCustomer)
        setUserInput(FilteredCustomer)
      }
      console.log(FilteredCustomer);
    };
    
    if (states.customers.length > 0) {
      getCustomerByID();
    }

  }, [customerId])


if (!states.customers.map) {
  return <>Loading...</>
}


// Interest Calculation Process
const startDateTime = moment(filteredCustomer?.dateGiven);
const endDateTime = moment();
const totalDays = endDateTime.diff(startDateTime, 'days');
const principal = filteredCustomer?.amount;
const interestRate = filteredCustomer?.interest;
const interestAmount = (principal * (interestRate / 100)) * (totalDays / 365).toFixed(1)
const AmountwithInterest = (principal + interestAmount).toFixed(2)


const handleInput = (e) => {
  const { name, value } = e.target;
  setfilteredCustomer({
    ...userInput,
    [name]: value
  })
}

const handleUpdateCustomer = (e) => {
  e.preventDefault();
  axios.put(states.hostname + '/api/customer/update', userInput).then((res) => {
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
      // window.location.reload()

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
    {!filteredCustomer ? (
      <>
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '80vh' }}>
          <img src='customer.png' height={200} /><br />
          <h3>No customer selected</h3>

        </div>
      </>
    ) : (

      <>

        <div className='container p-5'>
          <div className='d-flex justify-content-between'>
            <h6 className='d-flex justify-content-center align-items-center'>
              <span className="material-symbols-outlined me-2">person_pin</span>
              {filteredCustomer.fullname}<br />
              {filteredCustomer.phone}
            </h6>

            <h6 className='btn d-flex align-items-center btn-outline-danger rounded-5'>
              <span className="material-symbols-outlined me-2">delete</span>
              Delete customer
            </h6>
          </div>
          <button className='btn btn-sm d-flex justify-content-end btn-outline-success' data-bs-toggle="modal" data-bs-target="#editModal">
            <span className="material-symbols-outlined me-1 fs-5">edit</span>
            Edit details
          </button>
          <div className='d-flex justify-content-between mt-5'>
            <p>Principal Amount:</p>
            <p>Rs. {filteredCustomer.amount}</p>
          </div>
          <div className='d-flex justify-content-between'>
            <p>Interest Rate:</p>
            <p>{filteredCustomer.interest}% per annum</p>
          </div>
          <div className='d-flex justify-content-between'>
            <p>Date Given:</p>
            <p>
              {new Date(filteredCustomer.dateGiven).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })} ({totalDays} days ago)
            </p>
          </div>
          <div className='d-flex justify-content-between'>
            <p>Interest Amount:</p>
            <p>
              {interestAmount}
            </p>
          </div>
          <div className='d-flex justify-content-between'>
            <p>Principal with Interest:</p>
            <p>
              {AmountwithInterest}
            </p>
          </div>

        </div>

        {/* Edit Customer Data Modal START */}
        <div className="modal fade modal-lg" id="editModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{filteredCustomer.fullname}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">

                <form onSubmit={handleUpdateCustomer}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="fullname" value={filteredCustomer?.fullname} onChange={handleInput} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="number" className="form-control" name="phone" value={filteredCustomer?.phone} onChange={handleInput} required />
                    <div className="form-text">Data will be confidential.</div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <label className="form-label">Given Amount</label>
                      <input type="number" className="form-control" placeholder="Rs." name="amount" value={filteredCustomer?.amount} onChange={handleInput} required />
                    </div>

                    <div className="col">
                      <label className="form-label">Interest Rate (per annum)</label>
                      <input type="number" className="form-control" placeholder="%" name="interest" value={filteredCustomer?.interest} onChange={handleInput} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Date</label>
                      <input type="date" id="date" name="dateGiven" className="form-control" value={moment(filteredCustomer?.dateGiven).format('YYYY-MM-DD')} onChange={handleInput} required />
                    </div>
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

    )}
  </>
)
}
