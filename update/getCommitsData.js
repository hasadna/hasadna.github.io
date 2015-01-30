var fs = require('fs');
var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;
var jsonSanitizer = require('./modules/jsonSanitizer');
var commitsToJson = require('./modules/commitsToJson');
var eKnights = require('./modules/repositories').repositories;
var numStat = require('./modules/numStat');
var colors = require('colors');



/**
 * @description write File
 * @param {type} commits
 * @param {Repository} repo
 * @returns {void}
 */
function writeFile(commits, repo) {
    var data = new Array();

    function addSt(i) {
        if (i === 0) {
            data.sort(function(a, b) {
                // Turn strings into dates, and then subtract them to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
            });
            fs.writeFile(outputPath + repo.getFolderName() + ".json", JSON.stringify(data), function(err) {
            });
            return;
        }
        var result = '';
        var args = new Array(
                '--git-dir=' + repo.getDotGitFolder()
                , 'diff'
                , '--numstat'
                , commits[i].commit
                , commits[i - 1].commit
                );
        var process = spawn('git', args);
        process.stdout.on('data', function(data) { // Store stdout in result
            result += data.toString();
        });
        process.on('exit', function(code) { // When exit run the callback with the results.
//            console.log(commits[i - 1].commit + ' ' + commits[i].commit);

            var ns = numStat.parseNumStat(result);
            ns.sha = commits[i].commit;
            ns.body = commits[i].body;
            ns.date = commits[i].date;

            data.push(ns);
            addSt(--i);
        });
        process.stderr.on('data', function(data) {
            var buff = new Buffer(data);
            //console.log(buff.toString('utf8').red);
        });
    }

    addSt(commits.length - 1);
}



var outputPath = './';

for (var i = 0; i < 1; i++) {
    commitsToJson.commitsArray(eKnights[i].getMainRepository(), writeFile);
}
