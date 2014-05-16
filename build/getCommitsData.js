var fs = require('fs');
var path = require('path');
var util = require('util');
var jsonSanitizer = require('./jsonSanitizer');
var spawn = require('child_process').spawn;
var commitsToJson = require('./commitsToJson');

var colors = require('colors');
//var repositoriesData = require('../eKnightsData').eKnightsData;



/***
 * 
 * Column1 = inserted
 * Column2 = removed 
 * columns are separeted by tab (\t)
 * @param {string} lineStat
 * @returns {Object}
 */
var parseLineStat = function(lineStat) {
    var line = lineStat.split('\t');
    var stats = new Object();

    stats.path = line[2];

    var additions = parseInt(line[0], 10);
    var deletions = parseInt(line[1], 10);
    if (!isNaN(additions)) {
        stats.total = additions;
        stats.additions = additions;
        if (!isNaN(deletions)) {
            stats.deletions = deletions;
            stats.total += deletions;
        }
    } else if (!isNaN(deletions)) {
        stats.total += deletions;
        stats.deletions = deletions;
    }
    return stats;
};

/**
 * @param {string} numstat
 * @returns {undefined}
 */
var parseNumStat = function(numstat) {
    var lines = numstat.split('\n');
    var statArr = new Array();
    for (var i = 0; i < lines.length; i++) {
        var s = parseLineStat(lines[i]);
        statArr.push(s);
    }
    var totalSum = 0;
    for (var i = 0; i < statArr.length; i++) {
        if (statArr[i].total) {
            totalSum += statArr[i].total;
        }
    }

    return {
        'total': totalSum,
        'files': statArr
    };
};


//var dotGitPath = 'repositories/Open-Knesset/.git';
var dotGitPath = '/home/arnon/apache_public_html/hasadna.github.io/.git';
commitsToJson.commitsArray(dotGitPath, function(commits) {
    var data = new Array();

    function addSt(i) {
        if (i === 0) {
            data.sort(function(a, b) {
                // Turn strings into dates, and then subtract them to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
            });
//            console.log(JSON.stringify(data));
            fs.writeFile("testData.json", JSON.stringify(data), function(err) {
            });
            return;
        }
        var result = '';
        var args = new Array(
                '--git-dir=' + dotGitPath
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
//            console.log(result);

            var ns = parseNumStat(result);
            ns.sha = commits[i].commit;
            ns.body = commits[i].body;
            ns.date = commits[i].date;

            data.push(ns);
            addSt(--i);
        });
        process.stderr.on('data', function(data) {

            var buff = new Buffer(data);
//            console.log(buff.toString('utf8').red);
//            console.log(JSON.stringify(args));
        });
    }

    addSt(commits.length - 1);
});
