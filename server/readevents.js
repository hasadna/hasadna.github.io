//Known events file    
var events = require('./events.json');

//eKnights file
var eKnightsData = require('./dest/eKnightsData.js');
var repos = eKnightsData.eKnightsData;

//Git hub user credentials
var creds = require('./creds.js');

//Child process
var spawn = require('child_process').spawn;

var getEvents = function(url, page, callback){
    var events = '';
    var process = spawn('curl', [ '-u', creds.user + ':' + creds.pass, 'https://api.github.com/repos' + url + '/events?page=' + page]);
    
    process.on('exit', function(code) {
        console.log(events.length);
        console.log(JSON.parse(events).length);
    });
    
    process.stdout.on('data', function(data){
        var buff = new Buffer(data);
        events += buff.toString('utf8');
    });
};



//var newEvents;



for (var i in repos) {
   var repoName = repos[i].github_repo.substring(18);
    
    for(var i = 1; i <= 10; i++) {
       
   }
}



//
//
//var spawn = require('child_process').spawn;
//
//
//
//
//
//var isRootUser = function(callback) {
//var str='';
//   var process = spawn('curl',  ['-i', 'https://api.github.com/repos/hasadna/OpenCommunity/events']);
//
//   process.on('exit', function(code) {
//console.log(str);
//
//       callback();
//});
//
//   process.stdout.on('data', function(data) {
//       var buff = new Buffer(data);
//
//     str +=buff.toString('utf8')
//
//   });
//};
//
//
//isRootUser()
//
//
