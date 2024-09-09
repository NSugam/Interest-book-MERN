const express = require("express")
const router = express.Router()

const customerDataModel = require('../Modals/Customer')
const Authenticated = require('../middleware/auth');

// ROUTE 1: Add new customer
router.post('/add', Authenticated, async (req, res) => {
    try {
        const { fullname, phone, amount, interest, type, dateGiven } = req.body;
        const checkPhone = await customerDataModel.find({ phone: phone })

        if (checkPhone == "") {
            customerDataModel.create({ fullname, phone, amount, interest, type, dateGiven })
            if (type === 'lender') {
                res.json({ message: "New Lender Added successfully", success: true })
            }
            if (type === 'customer') {
                res.json({ message: "New Customer Added Successfully", success: true })
            }

        } else {
            res.json({ message: "Phone number already exist", success: false })
        }
    } catch(error) {
        res.json({ message: error.message, success: false })
    }
})

// ROUTE 2: Get all customers
router.get('/all', async (req, res) => {
    const allCustomers = await customerDataModel.find()
    res.json(allCustomers)
})

// ROUTE 3: Update a customer data
router.put('/update', Authenticated, async (req, res) => {
    const { phone, fullname, amount, interest, dateGiven } = req.body;

    try {
        const customer = await customerDataModel.findOne({ phone: phone });

        if (!customer) return res.json({ message: "Customer not found", success: false });

        customer.fullname = fullname || customer.fullname;
        customer.amount = amount || customer.amount;
        customer.interest = interest || customer.interest;
        customer.dateGiven = dateGiven || customer.dateGiven;

        await customer.save();
        res.json({ message: "Customer data updated successfully", success: true });

    } catch (error) {
        console.error(error);
        res.json({ message: "Server error", success: false });
    }
});

// ROUTE 4: Delete customer by Id
router.post('/delete', Authenticated, async (req, res) => {
    const { customerId } = req.body
    try {
        await customerDataModel.findByIdAndDelete(customerId)
        res.json({ message: "Data deleted", success: true });

    } catch (error) {
        res.json({ message: "User not found", success: false });
    }
})

module.exports = router;