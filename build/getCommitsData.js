var fs = require('fs');
var path = require('path');
var util = require('util');
var jsonSanitizer = require('jsonSanitizer');
var spawn = require('child_process').spawn;
//var posix = require('posix');
var colors = require('colors');
//var repositoriesData = require('../eKnightsData').eKnightsData;



/**
 * @description Get log for fullPath. 
 * @param {Function} callBack to run with the result.
 * The result look like this: 
 * [{
 * commit: '70ea710d6c009bd659edbb1daac69d49223d9e50',
 * author: 'author name',
 * author_email: 'author.name@ gmail.com',
 * date: 'Wed Dec 19 04:46:01 2012 +0200',
 * body: 'some text'
 * }, ...
 * ]
 * @param {string} path of file to get its log.
 * @returns {void}
 */
var commitArr = function(path, callBack) {
    if (dotGitPath === '')
        throw new Error('\ngit-dir must be set.\nUse setGitDir to set it.'.red);
    var result = '';
    var separator = ' qqqqqqqq ';
    var args = new Array(
            '--git-dir=' + dotGitPath,
            "log",
            "--pretty=format:%H" + separator //  commit hash
            + "%an" + separator //  author name
            + "%ae" + separator // author email
            + "%ad" + separator // author date 
            + "%f" + separator // sanitized subject line, suitable for a filename
            + "%b" // body
            );
    var process = spawn('git', args);
    process.stdout.on('data', function(data) { // Store stdout in result 
//        console.log(data.toString().blue);
        result += data.toString();
    });
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
    });
    process.on('exit', function(code) { // When exit run the callback with the results.
//        console.log(code);

        var resArr = result.split(separator);
        for (var i = 0; i < resArr.length; i++)// Sanitize everything
            resArr[i] = jsonSanitizer.sanitize(resArr[i]);
        resArr.pop(); //Remove the last element

        var jsonStr = '[';
        for (var i = 0; i < resArr.length - 1; i += 5) { // Compose JSON string
            jsonStr +=
                    '{"commit":"' + resArr[i]
                    + '","author":"' + resArr[i + 1]
                    + '","author_email":"' + resArr[i + 2]
                    + '","date":"' + resArr[i + 3]
                    + '","body":"' + resArr[i + 4]
                    + '"},';
        }

        jsonStr = jsonStr.substring(0, jsonStr.length - 1) // Remove the last comma
                + ']'; // Close the Array

        /**
         * @type {Array}
         */
        try {
            var json = JSON.parse(jsonStr);
        }
        catch (e) {
            debugger;
            console.log(e.toString().red);
            console.log(jsonStr.red);
        }
        callBack(json);
    });
    process.stderr.on('data', function(data) {
        var buff = new Buffer(data);
        console.log(buff.toString('utf8').red);
    });
};


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
commitArr(dotGitPath, function(commits) {
//    console.log(JSON.stringify(commits));
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
                , "diff"
                , "--numstat"
                , commits[i].commit
                , commits[i - 1].commit
                );
        var process = spawn('git', args);
        process.stdout.on('data', function(data) { // Store stdout in result 
            result += data.toString();
        });
        process.on('exit', function(code) { // When exit run the callback with the results.
//            debugger;
            console.log(commits[i - 1].commit);
            console.log(commits[i].commit);
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
            console.log(buff.toString('utf8').red);
        });
    }
    if (commits === undefined)
        debugger;
    addSt(commits.length - 1);
});
