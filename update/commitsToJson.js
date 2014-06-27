var jsonSanitizer = require('./jsonSanitizer');
var spawn = require('child_process').spawn;
var colors = require('colors');

/**
 * @description Get JSON array of commits for path in array. 
 * @param {Repository} repo of file to get its log.
 * @param {Function} callBack to run with the result.
 * The result look like this: 
 * [{
 * commit: '70ea710d6c009bd659edbb1daac69d49223d9e50',
 * date: 'Wed Dec 19 04:46:01 2012 +0200',
 * body: 'some text'
 * }, ...
 * ]
 * @returns {void}
 */
module.exports.commitsArray = function(repo, callBack) {

    var result = '';
    var separator = ' qqqqqqqq ';
    var args = [
        '--git-dir=' + repo.getDotGitFolder()
                , "log"
                , "--pretty=format:%H" //  commit hash
                + separator + "%an" //  author name
                + separator + "%ae" // author email
                + separator + "%ad" // author date 
                + separator + "%f" // sanitized subject line, suitable for a filename
                + separator + "%b"  // body
    ];
    var process = spawn('git', args);
    process.stdout.on('data', function(data) { // Store stdout in result 
        result += data.toString();
    });
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
    });

    process.on('exit', function(code) { // When exit run the callback with the results.

        var resArr = result.split(separator);
        for (var i = 0; i < resArr.length; i++)// Sanitize everything
            resArr[i] = jsonSanitizer.sanitize(resArr[i]);
        resArr.pop(); //Remove the last element

        var jsonStr = '[';
        for (var i = 0; i < resArr.length - 1; i += 5) { // Compose JSON string
            if (resArr[i].indexOf('\\n') === -1)
                var hash = resArr[i];
            else
                var hash = resArr[i].split('\\n')[resArr[i].split('\\n').length - 1];

            jsonStr +=
                    '{"commit":"' + hash
//                    + '","author":"' + resArr[i + 1]
//                    + '","author_email":"' + resArr[i + 2]
                    + '","date":"' + resArr[i + 3]
//                    + '","body":"' + resArr[i + 4]
                    + '"},';
        }

        jsonStr = jsonStr.substring(0, jsonStr.length - 1) // Remove the last comma
                + ']'; // Close the Array

        try {
            /**
             * @type {Array}
             */
            var jsonArray = JSON.parse(jsonStr);
        }
        catch (e) {
//            debugger;
            console.log(e.toString().red);
            console.log(jsonStr.red);
        }
        callBack(jsonArray, repo);
    });
    process.stderr.on('data', function(data) {
        var buff = new Buffer(data);
        console.log(buff.toString('utf8').red);
    });
}


