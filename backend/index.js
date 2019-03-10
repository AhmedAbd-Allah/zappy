const express = require('express');
const app = express();
const Config = require('./Config')
const twitterController = require('./Controllers/twitter')
const slackController = require('./Controllers/slack');
const Twitter = require('twitter')
const slackData = Config.slack;
const client = new Twitter({
  consumer_key: Config.twitter.consumer_key,
  consumer_secret: Config.twitter.consumer_secret,
  access_token_key: Config.twitter.access_token_key,
  access_token_secret: Config.twitter.access_token_secret
});
const dbURI = process.env.MONGO_URI? process.env.MONGO_URI : 'mongodb://localhost:27017/zappy';


// Startup database connection
const mongoose = require('mongoose');
mongoose.connect(dbURI, { useNewUrlParser: true });


// allow cross origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



// listen to slack channel
slackController.listen(slackData, function (err, data) {
  if (err)
    return (err)
  data = JSON.parse(data)
  data.text = ' ' + data.text + ' ';
  var regex = new RegExp(' go ', 'i');
  
  if (data.text && data.text.match(regex)) {
    var params = { screen_name: Config.twitter.screen_name }
    // var params = { user_id: Config.twitter.account_id }
    client.get(Config.twitter.URL, params, function (error, tweets, res) {
      if (error)
        return (error)
      twitterController.saveTweets(tweets, function (err, addedTweets) {
        if (err)
          return err;
        return addedTweets
      })

    });
  }
})



app.get('/', twitterController.getTweets)


app.listen(Config.port, () => {
  console.log("Server is on and listening on port ", Config.port);
});

module.exports = app
