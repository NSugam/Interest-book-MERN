import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Context } from '../../context/SharedState';
import EditCustomerModal from '../EditCustomerModal';
import moment from 'moment';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';

export default function RightBody() {
  const states = useContext(Context)
  const location = useLocation();
  const { filteredCustomer, setfilteredCustomer } = useContext(Context)

  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('id');
  window.history.replaceState({}, document.title, window.location.pathname); //removing parameter to clean the URL

  useEffect(() => {
    const getCustomerByID = () => {
      const FilteredCustomer = states.customers.find((customer) => customer._id === customerId);
      if (FilteredCustomer) {
        setfilteredCustomer(FilteredCustomer)
      }
    };

    if (states.customers.length > 0) {
      getCustomerByID();
    }

  }, [customerId])

  if (!states.customers.map) {
    return <>Loading...</>
  }

  const handleDelete = (customerId) => {
    axios.post(states.hostname + '/api/customer/delete', {customerId}).then((res) => {
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

  // Interest Calculation Process
  const startDateTime = moment(filteredCustomer?.dateGiven);
  const endDateTime = moment();
  const totalDays = endDateTime.diff(startDateTime, 'days');
  const principal = filteredCustomer?.amount;
  const interestRate = filteredCustomer?.interest;

  // Interest per day calculation
  const interestPerDay = ((principal * (interestRate / 100)) / 365).toFixed(2);
  const totalInterestAmount = (interestPerDay * totalDays).toFixed(3);
  const AmountwithInterest = (principal + parseFloat(totalInterestAmount)).toFixed(2);


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
          <div className='container p-4'>

            <div className='d-flex justify-content-between'>
              <h6 className='d-flex justify-content-center align-items-center'>
                <span className="material-symbols-outlined me-2 fs-2">person_pin</span>
                {filteredCustomer.fullname}<br />
                {filteredCustomer.phone}
              </h6>

              <button className='btn d-flex align-items-center btn-outline-danger rounded-5' onClick={()=>handleDelete(customerId)}>
                <span className="material-symbols-outlined me-2">delete</span>
                Delete customer
              </button>
            </div>
            <EditCustomerModal />
            <button className='btn btn-sm d-flex justify-content-end btn-outline-success mt-2' data-bs-toggle="modal" data-bs-target="#editModal">
              <span className="material-symbols-outlined me-1 fs-5">edit</span>
              Edit details
            </button>
            <div className='d-flex justify-content-between mt-4'>
              <p>Principal Amount:</p>
              <p>Rs. {filteredCustomer.amount}</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Interest Rate:</p>
              <p>{filteredCustomer.interest}% per annum</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Date:</p>
              <p>
                {new Date(filteredCustomer.dateGiven).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })} ({totalDays} days ago)
              </p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Interest:</p>
              <p>
                {interestPerDay} / day
              </p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Total Interest:</p>
              <p>
                {totalInterestAmount}
              </p>
            </div>
            <div className={`d-flex fw-bold justify-content-between ${filteredCustomer.type === 'lender' ? 'text-danger' : 'text-success'}`}>
              <p>Principal with Interest:</p>
              <p>
                {AmountwithInterest}
              </p>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <img src='book.png' />
            </div>
          </div>
        </>
      )}
    </>
  )
}
