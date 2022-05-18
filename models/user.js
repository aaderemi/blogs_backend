const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    name: String,
    passwordHash: String,
    blogs: [{type:mongoose.Types.ObjectId, ref:'Blog'}]
})

userSchema.set('toJSON', {
    transform: (doc, retObj)=>{
        retObj.id = retObj._id.toString()
        delete retObj._id
        delete retObj.__v
        delete retObj.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)