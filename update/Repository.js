/***
 * @constructor
 * @param {Object} data
 * @returns {Repository}
 */
function Repository(data) {
    var self = this;
    /**
     * @type {string}
     */
    this.name = data.name;
    /**
     * @description Repository URL.
     * @type {string}
     */
    this.url = data.url;
    /**
     * @type {string}
     */
    this.about = data.about;
    /**
     * @type {boolean}
     */
    this.main = data.main;
}
/**
 * @description Retrive folder name from repository URL.
 * Assume .git at the end of str.
 * @example getFolderName('https://github.com/hasadna/Open-Knesset.git') - return 'Open-Knesset' 
 * @returns {string} Folder name
 */
Repository.prototype.getFolderName = function() {
    var lastSlash = self.url.lastIndexOf("/");
    return this.url.substring(lastSlash + 1, self.url.length);
};

Repository.prototype.getDotGitFolder = function() {
    return __dirname + "/repositories/" + this.getFolderName() + "/.git";
};

Repository.prototype.getGithubApiUrl = function() {
    return this.url.replace('https://github.com/', 'https://api.github.com/repos/');
};


// If we are running from node let be a module.
if (typeof module !== 'undefined' && module.exports)
    module.exports.Repository = Repository;