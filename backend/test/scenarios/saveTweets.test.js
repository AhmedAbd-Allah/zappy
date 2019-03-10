const chai = require('chai');
const expect = require('chai').expect
const should = chai.should();
const addContext = require('mochawesome/addContext');
const app = require('../../index');
const twitterController = require('../../Controllers/twitter')
const slackController = require('../../Controllers/slack')
const Config = require('../../Config')
const slackData = Config.slack;
const chaiHttp = require('chai-http');




describe("Save Tweets Test", function () {
    afterEach(function (done, res) {
        addContext(this, {
            title: "Request",
            value: this.request
        });
        addContext(this, {
            title: "Response",
            value: this.response
        });
        this.request = null;
        this.response = null;
        done();
    })

    var newTweets = [{ "_id": "5c83c355dcc9e468863155e9", "created_at": "Sun Dec 10 09:06:28 +0000 2017", "text": "Hello from Elements office", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155ea", "created_at": "Wed Dec 06 16:02:44 +0000 2017", "text": "Tell us on #zappy about your experience.", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155ec", "created_at": "Tue Dec 05 19:11:03 +0000 2017", "text": "Zappy is in its final phase. Congrats!", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155ed", "created_at": "Tue Dec 05 19:06:02 +0000 2017", "text": "Zappy is now ready to launch... Are you ready?!", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155eb", "created_at": "Wed Dec 06 15:55:43 +0000 2017", "text": "WOW! Now you can check Zappy, here: https://t.co/GjIA19DC0w..", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155f0", "created_at": "Sun Dec 03 10:02:45 +0000 2017", "text": "Hello! This is the first tweet from FictionFone.", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155ef", "created_at": "Sun Dec 03 10:52:46 +0000 2017", "text": "Our developers are building 'Zappy'. Can you guess what is Zappy?! ;)", "__v": 0 },
    { "_id": "5c83c355dcc9e468863155ee", "created_at": "Tue Dec 05 14:13:55 +0000 2017", "text": "This is my third tweet everyone. Please welcome #FictionFone", "__v": 0 }]

    it('should save new Tweets', function (done) {


        this.request = newTweets;
        var response;

        twitterController.saveTweets(newTweets, function (err, savedTweets) {
            response = savedTweets;
            expect(err).to.be.null
            expect(savedTweets.length).to.equal(newTweets.length);
            for (var i = 0; i < savedTweets; i++) {
                expect(savedTweets[i].created_at).to.equal(newTweets[i].created_at)
                expect(savedTweets[i].text).to.equal(newTweets[i].text)
            }
            done()
        })
        this.response = response

    })


    it('should connect with slack', function (done) {
        var request = Config.slack;
        this.request = request;


        slackController.connect(request, function (err, response) {
            expect(err).to.be.null

            expect(response.requestData).to.have.property("token");
            expect(response.requestData).to.have.property("name");
            expect(response.workSpaceData).to.have.property("wsUrl");
            expect(response.workSpaceData).to.have.property("self");
            expect(response.workSpaceData).to.have.property("team");
            expect(response.workSpaceData).to.have.property("channels");
            expect(response.workSpaceData).to.have.property("users");
            expect(response.workSpaceData).to.have.property("ims");
            expect(response.workSpaceData).to.have.property("groups");
            expect(response.workSpaceData.self.name).to.equal("zappybot");

            done()
        })

    })


    it('should listen to slack', function (done) {
        var request = Config.slack;
        this.request = request;


        slackController.listen(request, function (err, response) {
            expect(err).to.be.null
            response = JSON.parse(response)
            expect(response).to.have.property("type");

            done()
        })

    })

    it('should send request to  slack', function (done) {
        var request = Config.slack;



        var request = {
            url: Config.slack.apiURL + 'rtm.start',
            form: slackData
        };
        this.request = request;
        var res;
        slackController.apiRequest(request).then((data) => {

            expect(data.ok).to.be.true
            expect(data).to.have.property("url");
            expect(data).to.have.property("self");
            expect(data).to.have.property("team");
            done()
        }).catch(err => {
            console.log(err)
            // return cb(err)
        })




    })

    chai.use(chaiHttp);
    it('should get Tweets from db', function (done) {

        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                expect(res.body.length).to.equal(newTweets.length);
                done();
            });

    })


})
