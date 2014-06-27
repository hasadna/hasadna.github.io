var spawn = require('child_process').spawn;
var colors = require('colors');




/**
 * @description Throws error if user name of the user who run this proses is not root.
 * @param {function} callback to run if the user is root.
 * @param {boolean} [testing=false] optional - if true no root check happen, just run the callback.
 * @throws {Error} "User must be root." - If user name is not root.
 * @see man whoami
 * @returns {void}
 * TODO: maybe it's better to use id 
 */
module.exports.isRootUser = function(callback, testing) {
    if (testing) {
        callback();
        return;
    }
    var process = spawn('whoami');

    //process.on('exit', function(code) {});

    process.stdout.on('data', function(data) {
        var buff = new Buffer(data);

        if (buff.toString('utf8').trim() !== 'root')
            throw Error("User must be root.".red);

        callback();
    });
};
