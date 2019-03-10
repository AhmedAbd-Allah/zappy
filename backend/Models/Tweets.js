const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    created_at:{
        type:String
    },
    text:{
        type:String
    },
    userName:{
        type:String
    },
    profile_image_url:{
        type:String
    }
});

mongoose.model('tweets',tweetSchema);

module.exports = mongoose.model('tweets');
