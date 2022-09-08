import mongoose from 'mongoose'

var Schema = mongoose.Schema

let InfoRequestSchema = new Schema({
    requester: {
        type: String,
        required: true,
    },
    requestee: {
        type: String,
        required: false,
    },
    info_categories: {
        type: String,
        required: false,
    }
}, {timestamps: true})

export default mongoose.model('InfoRequestModel', InfoRequestSchema)