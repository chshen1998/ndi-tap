import mongoose from 'mongoose'

var Schema = mongoose.Schema

// Information Request models serve as transaction logs to keep track to & from personal information is being sent
let InfoRequestSchema = new Schema({
    requester_uinfin: {
        type: String,
        requested: true,
    },
    requestee_uinfin: {
        type: String,
        required: true,
    },
    scopes: {
        type: String,
        required: true
    }
}, {timestamps: true})


export default mongoose.model('InfoRequestModel', InfoRequestSchema)