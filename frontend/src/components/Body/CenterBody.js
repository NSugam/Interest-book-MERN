import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/SharedState'
import { useLocation, useNavigate } from 'react-router-dom'
import '../css/CenterBody.css'

export default function CenterBody() {
  const states = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  const [filteredCustomer, setFilteredCustomer] = useState({})

  const [searchParam, setSearchParam] = useState()
  useEffect(() => {
    const getCustomers = () => {
      let FilteredCustomer = [];

      if (location.pathname.includes('/lenders')) {
        FilteredCustomer = states.customers.filter((customer) => customer.type === 'lender');

      } else if (location.pathname.includes('/')) {
        FilteredCustomer = states.customers.filter((customer) => customer.type === 'customer');
      }

      if (searchParam) {
        FilteredCustomer = FilteredCustomer.filter((customer) =>
          customer.fullname.toLowerCase().includes(searchParam.toLowerCase())
        );
      }
      setFilteredCustomer(FilteredCustomer);
    };

    if (!states.loading) {
      getCustomers();
    }

  }, [location.pathname, states, searchParam])

  if (states.loading) {
    return <>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '80vh' }}>
        <img src='waiting.jpg' height={150} /><br />
        <h3>Waiting for server...</h3>
      </div>
    </>
  }

  if (!filteredCustomer.length && !searchParam?.length) {
    return <>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '80vh' }}>
        <img src='customer.png' height={200} /><br />
        <h3>No customer data !</h3>
        <button className='btn btn-success btn-sm d-flex mb-4' onClick={() => states.toggleModal()}><span className="material-symbols-outlined me-2">person_add</span>Add new data</button>
      </div>
    </>
  }

  const handleUser = (id) => {
    navigate('?id=' + id)
  }

  // Calculate the total amount
  const totalAmount = filteredCustomer.reduce((acc, data) => acc + data.amount, 0);

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between'>

        {location.pathname.includes('/lenders') ?
          <>
            <h6 className='d-flex justify-content-center text-danger'>Total Loan: Rs. {totalAmount}</h6>
            <h6 className='d-flex justify-content-center text-danger'>
              Loan with Interest: Rs. {states.totalForLender}
              <span className="material-symbols-outlined ms-2" style={{ color: 'red' }}>north_east</span>
            </h6> </>
          :
          <>
            <h6 className='d-flex justify-content-center text-success'>Total: Rs. {totalAmount}</h6>
            <h6 className='d-flex justify-content-center text-success'>
              Amount with Interest: Rs. {states.totalForCustomer}
              <span className="material-symbols-outlined ms-2" style={{ color: 'green' }}>call_received</span>
            </h6> </>
        }

      </div>
      <hr className='m-auto' />
      <div className="sticky-container pt-4" style={{ backgroundColor: 'white' }}>
        <h6 className=''>Search for customers</h6>
        <div className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Search by Name" onChange={e => setSearchParam(e.target.value)} />
          <button className="btn btn-outline-danger d-flex">
            <span className="material-symbols-outlined">person_search</span>
          </button>
        </div>
      </div>

      <table className="table table-hover table-borderless table-striped">
        <thead>
          <tr>
            <th scope="col" className='text-secondary'>NAME</th>
            <th scope="col" className='text-secondary text-center'>Interest Rate</th>
            <th scope="col" className='text-secondary text-end'>AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomer.map((data) =>

            <tr onClick={() => handleUser(data._id)} style={{ cursor: 'pointer' }} key={data._id}>
              <td>{data.fullname}<br />
                <div className='text-secondary d-flex'>
                  <span className="material-symbols-outlined me-1" style={{ fontSize: '20px' }}>pending_actions</span>
                  {new Date(data.dateGiven).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}</div>
              </td>

              <td className=' text-danger text-center'>{data.interest}% p. a</td>

              <td className='text-end text-success'>Rs. {data.amount}<br />
                {data.type === 'lender' ?
                  <span className='text-danger text-italic'>you got</span> :
                  <span className='text-secondary text-italic'>without interest</span>}
              </td>
            </tr>

          )}


        </tbody>
      </table>

      <div className='d-flex justify-content-end sticky-bottom'>
        {location.pathname.includes('/lenders') ?
          <button className='btn btn-danger btn-sm d-flex mb-4' onClick={() => states.toggleModal()}><span className="material-symbols-outlined me-2">person_add</span>Add Lender</button> :
          <button className='btn btn-success btn-sm d-flex mb-4' onClick={() => states.toggleModal()}><span className="material-symbols-outlined me-2">person_add</span>Add Customer</button>}
      </div>

    </div>
  )
}
