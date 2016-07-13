var express     = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    mongoose    = require('mongoose'),
    session     = require('express-session'),
    passport    = require('passport');




// App definition
var app = express();

require('./config/passport')(passport);


// Middleware
app.use(session({
    secret: 'devMountainISfullOFsecrets',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());



app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname + '/'));


var UserController = require('./controllers/UserController.js');

// -> Auth
app.post('/api/auth', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
}));

app.get('/api/get-user', UserController.getUser);




var mongooseUri = 'mongodb://localhost/auth';
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    console.log('Mongoose uri:', mongooseUri);
});

app.listen(3000, function () {
    console.log('Aliens are watching on port: ' + 3000 );
});
