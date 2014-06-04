"use strict";
var spawn = require('child_process').spawn;
var colors = require('colors');
var fs = require('fs');
var path = require('path');
var jsonSanitizer = require('./jsonSanitizer');


/**
 * @description Use by getLogForFile to synchronize all the instances.
 * @see http://stackoverflow.com/questions/5153492/models-of-concurrency-in-nodejs/5177773#5177773
 * @type {number}
 */
var lock = 0;

/**
 * @type {Function} To run after all of the getLogForFile instances were done.
 */
var functionToRun;

/**
 * @param {Function} func To run after all of the getLogForFile instances were done
 * @returns {void}
 */
var setFunction = function(func) {
    functionToRun = func;
};



/**
 * @description The folder containing the repository.
 * @type {string}
 */
var containingFolder = '';
/**
 * @type {string}
 */
var dotGitPath = '';

/**
 * @description Set the path of .git folder.
 * Its use as --git-dir parameter for git.
 * @see  --git-dir on: $ man git
 * @param {string} path
 * @returns {void}
 */
var setDotGitPath = function(path) {
    dotGitPath = path;
};

/**
 * @type string
 */
var parentPath = module.parent.filename;

/**
 * @description Find the path of parent module and set 'parentPath'  with it.
 * @param {string} path 
 * @returns {void}
 */
function findParentPath(path) {
    var lastSlash = path.lastIndexOf("/");
    return path.substring(0, lastSlash);
}

parentPath = findParentPath(parentPath);


/**
 * @description Retrive folder name from repository URL.
 * Assume .git at the end of str.
 * @example getFolderName('https://github.com/hasadna/Open-Knesset.git') - return 'Open-Knesset'
 * @param {string} str Repository URL.
 * @returns {string} Folder name
 */
var getFolderName = function(str) {
    var lastSlash = str.lastIndexOf("/");
    var end = str.length;
    if (str.indexOf('.git') === -1)
        end = str.length;

    return str.substring(lastSlash + 1, end);
};

/**
 * @description clone or pull from github repository.
 * @public
 * @param {string}   repoURL  Repository URL.
 * @param {Function} callBack to run when clone/pull done.
 * @param {boolean}  verbose  Do you want a lot of output?
 * @returns {void}
 */
var cloneOrPull = function(repoURL, callBack, verbose) {
    containingFolder = getFolderName(repoURL);
    var clone = false;
    var gitFolder = '--git-dir=' + parentPath + '/repositories/' + containingFolder + '/.git';

    if (fs.existsSync(parentPath + '/repositories/' + containingFolder)) // If repository exist pull it, otherwise clone it.
        var process = spawn('git', [gitFolder, 'pull']);
    else {
        var process = spawn('git', ['clone', repoURL]);
        clone = true;
    }

    process.on('exit', function(code) { // When exit run the callback.
        if (clone === true) {
            var src = parentPath + '/' + containingFolder;
            var des = parentPath + '/repositories/' + containingFolder;
            fs.renameSync(src, des);
            console.log(containingFolder + ' moved from: \n' + parentPath + '\nTo:\n' + parentPath + '/repositories/');
        }
        callBack(code, containingFolder);
    });

    if (verbose === true) {
        process.stdout.on('data', function(data) {
            var buff = new Buffer(data);
            console.log(buff.toString('utf8'));
        });
        process.stderr.on('data', function(data) {
            var buff = new Buffer(data);
            console.log(buff.toString('utf8'));
        });
    }
};



/**
 * @description Get path relative to containingFolder 
 * @param {string} fullPath
 * @returns {string}
 */
function getRelativePath(fullPath) {
    if (containingFolder === '')
        throw new Error('\ncontainingFolder must be set.\nUse cloneOrPull first.'.red);

    var startIndex = fullPath.indexOf(containingFolder) + containingFolder.length;
    return fullPath.substring(startIndex + 1, fullPath.length);
}

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
 * @param {string} fullPath of file to get its log.
 * @returns {void}
 */
var getLogForFile = function(fullPath, callBack) {
    if (dotGitPath === '')
        throw new Error('\ngit-dir must be set.\nUse setGitDir to set it.'.red);

    var result = '';
    var separator = ' qqqqqqqq ';

    var relativePath = getRelativePath(fullPath);
    if (relativePath === "")
        relativePath = containingFolder + '/';
//    console.log("fullPath: " + fullPath);

    var args = new Array(
            '--git-dir=' + dotGitPath,
            "log",
            "--pretty=format:%H" + separator //  commit hash
            + "%an" + separator //  author name
            + "%ae" + separator // author email
            + "%ad" + separator // author date 
            + "%f" + separator // sanitized subject line, suitable for a filename
            + "%b", // body
            "--",
            fullPath
            );

    lock++;
    var process = spawn('git', args);



    process.stdout.on('data', function(data) { // Store stdout in result 
        result += data.toString();
    });

    process.on('exit', function(code) { // When exit run the callback with the results.

        var resArr = result.split(separator);

        for (var i = 0; i < resArr.length; i++)// Sanitize everything
            resArr[i] = jsonSanitizer.sanitize(resArr[i]);

        resArr.pop();//Remove the last element

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

        jsonStr = jsonStr.substring(0, jsonStr.length - 1)  // Remove the last comma
                + "]";

        if (jsonStr === "]") // For no data
            jsonStr = "[]";

        var json = JSON.parse(jsonStr);

        callBack(json);
        lock--;
        if (lock === 0)
            functionToRun();

    });
    process.stderr.on('data', function(data) {
        var buff = new Buffer(data);
        console.log(buff.toString('utf8').red);
    });
};


module.exports.setFunction = setFunction;
module.exports.setDotGitPath = setDotGitPath;
module.exports.cloneOrPull = cloneOrPull;
module.exports.getLogForFile = getLogForFile;
module.exports.getFolderName = getFolderName;

