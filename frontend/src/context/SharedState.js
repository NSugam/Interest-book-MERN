import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import moment from 'moment';
import { Flip, toast } from 'react-toastify';

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_HOSTNAME

    // Loading state
    const [loading, setLoading] = useState(true);

    // Storing user details
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Stores the products data from backend
    const [customers, setCustomers] = useState([])

    //Stores the filtered Customer data (for auto renders when update)
    const [filteredCustomer, setfilteredCustomer] = useState()

    //Stores the Total+Interest for Lender
    const [totalForLender, setTotalForLender] = useState(0);

    //Stores the Total+Interest for Customer
    const [totalForCustomer, setTotalForCustomer] = useState(0);

    //For Modal Toggle (AddCustomerModal.js)
    const toggleModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
        modal.toggle()
    }

    useEffect(() => {
        const getAllCustomers = async () => {
            try {
                const res = await axios.get(hostname + '/api/customer/all');
                setCustomers(res.data);
                setLoading(false); // If Success, stop loading
            } catch (error) {
                setLoading(true); // Keep loading true in case of error
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
            }
        };
    
        const getUserData = async () => {
            try {
                const res = await axios.get(hostname + '/api/user/profile');
                if (res.data.success) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                setLoading(false); // Stop loading on success
            } catch (error) {
                setLoading(true); // Keep loading true in case of error
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
            }
        };
    
        const fetchData = async () => {
            setLoading(true); // Set loading true before starting the API calls
            try {
                await Promise.all([getAllCustomers(), getUserData()]);
            } catch (error) {
                setLoading(true); // If an error occurs, keep loading true
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const totalForLender = () => {
            if (customers.length === 0) return;
            let totalAmountforLender = 0;
            let totalAmountforCustomer = 0;
            customers.forEach((customer) => {
                if (customer.type === 'lender') {
                    const startDateTime = moment(customer.dateGiven);
                    const endDateTime = moment();
                    const totalDays = endDateTime.diff(startDateTime, 'days');
                    const principal = customer.amount;
                    const interestRate = customer.interest;
                    const interestAmount = (principal * (interestRate / 100)) * (totalDays / 365);
                    const amountWithInterest = principal + interestAmount;
                    totalAmountforLender += amountWithInterest;
                }
                if (customer.type === 'customer') {
                    const startDateTime = moment(customer.dateGiven);
                    const endDateTime = moment();
                    const totalDays = endDateTime.diff(startDateTime, 'days');
                    const principal = customer.amount;
                    const interestRate = customer.interest;
                    const interestAmount = (principal * (interestRate / 100)) * (totalDays / 365);
                    const amountWithInterest = principal + interestAmount;
                    totalAmountforCustomer += amountWithInterest;
                }
            });
            setTotalForLender(totalAmountforLender.toFixed(2));
            setTotalForCustomer(totalAmountforCustomer.toFixed(2));
        };

        totalForLender();
    }, [customers, filteredCustomer])

    return (
        <Context.Provider value={{
            hostname,
            user, setUser,
            isAuthenticated, setIsAuthenticated,
            customers, setCustomers,
            filteredCustomer, setfilteredCustomer,
            totalForCustomer, totalForLender,
            loading, setLoading,
            toggleModal
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };
