var Twitter = require('twitter');

var packageSamResponses = [
    'Can I see your Package?',
    'Packages are great!',
    'I have an exceptionally nice package.',
    'Without packages, life would be a mistake.',
    'That which does not kill us makes us packages.',
    'Yes we packages!',
    'You can not blame gravity for falling in packages',
    'The purpose of our lives is to be packages',
    'Package is the best meditation.',
    'Oooooh look at this useful package!!',
    'May the package be with you',
    'Do not cry because it is over, smile because it is a package.',
    'So many books, so little packages.'
];

var previousRandomNum;
var samReply = function(arrayOfResponses) {
    var randomNumber = Math.floor(Math.random() * packageSamResponses.length);

    if (randomNumber === previousRandomNum) {
        randomNumber = randomNumber === 0 ? (randomNumber + 1) : (randomNumber - 1);
    }

    previousRandomNum = randomNumber;

    return arrayOfResponses[randomNumber];
};

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = {
    path: '/home',
    method: 'GET',
    handler: function(req, reply){
        client.stream('statuses/filter', {track: 'PackageSam'}, function(stream) {
            stream.on('data', function(tweet) {
                client.post('statuses/update', {status: samReply(packageSamResponses)}, function(error, tweet, response) {
                    if (error) throw error;
                    console.log(tweet); // Tweet body.
                    console.log(response); // Raw response object.
                });
            });

            stream.on('error', function(error) {
                throw error;
            });
        });
        reply.view('home');
    }
};
