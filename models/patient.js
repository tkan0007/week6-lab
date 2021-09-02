const mongoose = require('mongoose');
const { message } = require('statuses');
const { StringDecoder } = require('string_decoder');

let patientSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    fullName: {
        type: String,
        required: true
    },
    doctorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    age: {
        type: Number,
        validate:{
            validator: function(age){
                return age >= 0 && age<= 120;
            },
            message: 'Age should be a number between 10 and 120.'
        }
    },
    dateVisit: {
        type: Date,
        default:Date.now
    },
    description:{
        type:String,
        validate:{
            validator:function(description){
                return description.length >= 10;
            },
            message: 'Description should be more than 10 characters.'
        }
    },

});

module.exports = mongoose.model('Patient', patientSchema);