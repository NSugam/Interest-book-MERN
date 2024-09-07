import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import moment from 'moment';

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_LOCALHOST

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

    useEffect( () => {
        const getAllCustomers = async () => {
            await axios.get(hostname + '/api/customer/all').then((res) => {
                setCustomers(res.data);
            });
        };

        const getUserData = async () => {
            await axios.get(hostname + '/api/user/profile').then((res) => {
                if (res.data.success) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            });
        };

         getAllCustomers();
         getUserData();

    }, []);

    useEffect(() => {
        const totalForLender = () => {
            if (customers.length === 0) return;
            let totalAmountforLender = 0;
            let totalAmountforCustomer = 0;
            customers.forEach((customer) => {
                if(customer.type === 'lender') {
                    const startDateTime = moment(customer.dateGiven);
                    const endDateTime = moment();
                    const totalDays = endDateTime.diff(startDateTime, 'days');
                    const principal = customer.amount;
                    const interestRate = customer.interest;
                    const interestAmount = (principal * (interestRate / 100)) * (totalDays / 365);
                    const amountWithInterest = principal + interestAmount;
                    totalAmountforLender += amountWithInterest;
                }
                if(customer.type === 'customer') {
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
            totalForCustomer,totalForLender,
            toggleModal
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };