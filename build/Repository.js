

/***
 * @constructor
 * @param {Object} data
 * @returns {Repository}
 */
function Repository(data) {
    var self = this;
    /***
     * @type {string}
     */this.name = data.name;
    /***
     * @description Repository URL.
     * @type {string}
     */
    this.url = data.url;
    /***
     * @type {string}
     */
    this.about = data.about;
    /***
     * @type {boolean}
     */
    this.main = data.main;


    /**
     * @description Retrive folder name from repository URL.
     * Assume .git at the end of str.
     * @example getFolderName('https://github.com/hasadna/Open-Knesset.git') - return 'Open-Knesset'
     * @param {string} str 
     * @returns {string} Folder name
     */this.getFolderName = function() {
        var lastSlash = self.url.lastIndexOf("/");
        return self.url.substring(lastSlash + 1, self.url.length);
    };


    this.getDotGitFolder = function() {
        return __dirname + "/repositories/" + self.getFolderName() + "/.git";
    };
}

// If we are running from node let be a module.
if (typeof module !== 'undefined' && module.exports)
    module.exports.Repository = Repository;
