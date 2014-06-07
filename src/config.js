
/**
 * @description Distinguish between developer mode to production mode.
 * @global
 */
var CONFIG = {
    PATH: "",
    /**
     * @description Return the path relative to mode(developer or production)
     * @param {String} path 
     * @returns {String}
     */
    relativizePath: function(path) {
        return CONFIG.PATH + path;
    }
};