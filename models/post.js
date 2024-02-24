const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, requried: true, maxLength: 100},
    body: String,
    published : {type: Boolean, default: false},
});

PostSchema.virtual("url").get(function() {
    return `/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);