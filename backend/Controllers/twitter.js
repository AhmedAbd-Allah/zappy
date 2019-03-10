const tweetsModel = require('./../Models/Tweets')
const async = require('async')




module.exports = {
    getTweets: function(req,res){
        tweetsModel.find({}, function (err, tweets) {
            if (err)
                res.json(err)
            res.json(tweets)
        })
    },

    saveTweets: function (newTweets, callback) {
        var dataHolder = {};
        async.series([
            function (cb) {
                tweetsModel.find({}, function (err, oldTweets) {
                    if (err)
                        return callback(err)
                    if (newTweets.length == oldTweets.length)
                        return callback(null, newTweets);
                    dataHolder.newTweets = newTweets;
                    dataHolder.oldTweets = oldTweets;
                    return cb(null)

                })
            },
            function (cb) {

                if (dataHolder.oldTweets.length > 0) {

                    var lastTweetDate = Date.parse(dataHolder.oldTweets[dataHolder.oldTweets.length - 1].created_at)
                    var newTweetDate = Date.parse(dataHolder.newTweets[dataHolder.newTweets.length - 1].created_at)
                    if (newTweetDate > lastTweetDate) {

                        tweetsModel.deleteMany({}, function (err, emptyModel) {
                            if (err)
                                return cb(err)
                        })
                    }
                    else {

                        return cb(null, dataHolder.newTweets)

                    }
                }

                tweetsModel.create(dataHolder.newTweets, function (err, savedTweets) {
                    if (err)
                        return cb(err)

                    dataHolder.newTweets = savedTweets
                    return cb(null)
                })
            }
        ], function (err) {

            if (err)
                return callback(err)
            return callback(null, dataHolder.newTweets)
        })
    }
}