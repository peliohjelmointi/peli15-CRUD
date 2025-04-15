const mongoose = require('mongoose')
const Schema = mongoose.Schema //Schema = dokumentin rakenne

// Luodaan Blogi-Schema:

const blogSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    description:{
        type: String,
        required : true
    },
    blogText: {
        type: String,
        required: true
    }
}, {
    timestamps: true //lisää tietokantaan createdAt ja updatedAt -kentät
})

const Blog = mongoose.model('Blog', blogSchema, 'XXX')
module.exports = Blog