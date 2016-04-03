var mongoose = require('mongoose');

/**
 * mongodb://username:password@localhost:27027/database
 * mongo ds041154.mlab.com:41154/angular-app -u <dbuser> -p <dbpassword>
 */
var dbURL = 'mongodb://localhost/Loc8r';
process.env.NODE_ENV = 'production';
if (process.env.NODE_ENV === 'production') {
    dbURL = 'mongodb://dx859:85941049@23.83.231.244:20045/test';
}
mongoose.connect(dbURL);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURL);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// Define function to accept message and callback function
var gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() { // Close Mongoose connection, passing through an anonymous function to run when closed
        console.log('Mongoose disconnected through ' + msg); // Output message and call callback when Mongoose connection is closed
        callback();
    });
};

// Listen for SIGUSR2, which is what nodemon uses
process.once('SIGUSR2', function() {
    // Send message to graceful- Shutdown and callback to kill process, emitting SIGUSR2 again
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});


require('./locations');
