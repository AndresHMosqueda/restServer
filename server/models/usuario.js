const mongoose = require('mongoose');

let Schema = mongoose.Schema;

//Define schema
let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        defaul: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('User', userSchema);

//modelo user con la config de userSchema