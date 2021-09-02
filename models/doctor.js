const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        auto:true,
        ref:'Patient'
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    date: {
        type: Date
        /*
        validate: {
            validator: function (date) {
                return (Date.now - date) >= 18 && (Date.now - date) <= 110;
            },
            message: 'Invalid DoB, please check again.'
        }
        */
    },
    address:{
        state:{
            type:String,
            required: true,
            validate:{
                validator:function(state){
                    return state.length >= 2 && state.length <= 3;
                },
                message: 'State should be within 2 or 3 characters.'
            }
        },
        suburb:{
            type:String
        },
        street:{
            type:String
        },
        unit:{
            type:String
        }
    },
    numPatient:{
        type:Number,
        validate:{
            validator:function(numPatient){
                return numPatient > 0;
            },
            message: 'Number of patient should be greater that 0.'
        }
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);