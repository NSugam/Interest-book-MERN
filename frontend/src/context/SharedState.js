import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_LOCALHOST

    // Storing user details
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Stores the products data from backend
    const [customers, setCustomers] = useState({})

    //For Modal Toggle (AddCustomerModal.js)
    const toggleModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
        modal.toggle()
    }

    useEffect(() => {
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


    return (
        <Context.Provider value={{
            hostname,
            user, setUser,
            isAuthenticated, setIsAuthenticated,
            customers, setCustomers,
            toggleModal
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };
