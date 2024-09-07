const express = require("express")
const router = express.Router()

const customerDataModel = require('../Modals/Customer')
const Authenticated = require('../middleware/auth');

// ROUTE 1: Add new customer
router.post('/add', Authenticated, async (req, res) => {
    const { fullname, phone, amount, interest, dateGiven } = req.body;
    const checkPhone = await customerDataModel.find({ phone: phone })

    if (checkPhone == "") {
        customerDataModel.create({ fullname, phone, amount, interest, dateGiven })
        res.json({ message: "Customer Added Successfully", success: true })

    } else {
        res.json({ message: "Phone number already exist", success: false })
    }
})

// ROUTE 2: Get all customers
router.get('/all', async (req, res) => {
    const allCustomers = await customerDataModel.find()
    res.json(allCustomers)
})

// ROUTE 3: Update a customer data
router.put('/update', async (req, res) => {
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

module.exports = router;