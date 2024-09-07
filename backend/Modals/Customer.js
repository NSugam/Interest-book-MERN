const mongoose = require("mongoose")

const customerDataSchema = new mongoose.Schema({
    fullname: String,
    phone: { type: Number, unique: true },
    amount: Number,
    interest: Number,
    type: String,
    dateGiven: { type: Date, default: Date.now}
})
const customerDataModel = mongoose.model("customer", customerDataSchema)

module.exports=customerDataModel