import React, { useContext } from 'react'
import { Context } from '../../context/SharedState'
import { useNavigate } from 'react-router-dom'

export default function CenterBody() {
  const states = useContext(Context)
  const navigate = useNavigate()

  if (!states.customers.map) {
    return <>Loading...</>
  }

  const handleUser = (id) => {
    navigate('/?id=' + id)
  }

  // Calculate the total amount
  const totalAmount = states.customers.reduce((acc, data) => acc + data.amount, 0);

  return (
    <div className='container mt-3'>
      <div className='d-flex justify-content-between'>
        <h6 className='d-flex justify-content-center text-danger'>Customer Details</h6>
        <h6 className='d-flex justify-content-center text-success'>You'll Get: Rs. {totalAmount} <span className="material-symbols-outlined ms-2" style={{ color: 'green' }}>call_received</span></h6>
      </div>
      <hr />
      <h6 className='mt-4'>Search for customers</h6>
      <div className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search by Name" />
        <button className="btn btn-outline-danger d-flex">
          <span className="material-symbols-outlined">person_search</span>
        </button>
      </div>

      <table className="table mt-4 table-hover table-borderless table-striped">
        <thead>
          <tr>
            <th scope="col" className='text-secondary'>NAME</th>
            <th scope="col" className='text-secondary text-center'>Interest Rate</th>
            <th scope="col" className='text-secondary text-end'>AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {states.customers.map((data) =>

              <tr onClick={() => handleUser(data._id)} style={{ cursor: 'pointer' }} key={data._id}>
                <td>{data.fullname}<br />
                  <div className='text-secondary d-flex'><span className="material-symbols-outlined me-1" style={{ fontSize: '20px' }}>phone_in_talk</span>{data.phone}</div>
                </td>

                <td className=' text-danger text-center'>{data.interest}% p. a</td>

                <td className='text-end text-danger'>Rs. {data.amount}</td>
              </tr>

          )}


        </tbody>
      </table>

      <div className='d-flex justify-content-end'>
        <button className='btn btn-outline-success btn-sm d-flex' onClick={() => states.toggleModal()}><span className="material-symbols-outlined me-2">person_add</span>Add customer</button>
      </div>

    </div>
  )
}
