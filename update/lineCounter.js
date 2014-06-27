

/**
 * @description Count size(in bytes), and lines in files and folders.
 * @constructor
 */
function LineCounter() {
    var self = this;
    var fs = require('fs');
    var path = require('path');

    /**
     * @private
     * @type {Array<string>}
     */
    var allFiles = new Array();

    /**
     * @description Fill allFiles array with all file names under currentPath - ignor folders
     * @param {string} currentPath
     * @returns {void}
     */
    var traverseFileSystem = function(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (var f in files) {
            var currentFile = currentPath + '/' + files[f];
            try {
                var stats = fs.statSync(currentFile);
            } catch (e) {
                // console.log(currentFile);
                continue;// avoid hard links
            }
            if (stats.isFile() && !isGitFile(currentFile))
                allFiles.push(currentFile);
            else if (stats.isDirectory() && !isGitFile(currentFile))
                traverseFileSystem(currentFile);
        }
    };

    /**
     * @description Return true if fileName is or within the .git folder.
     * @param {string} fileName To check if its a git file.
     * @returns {boolean}
     */
    function isGitFile(fileName) {
        if (fileName.search("\.gitmodules") !== -1 // We do wants this files.
                || fileName.search("\.gitkeep") !== -1
                || fileName.search("\.gitignore") !== -1) {
            return false;
        }
        else if (fileName.search(/[\/]{1,1}\.git[\/]{0,1}/) !== -1) {
            return true;
        }
        return false;
    }


    /**
     * @description Return file size in bytes - for hard links return 0.
     * @param {string} path to get is size.
     * @returns {number} File size in bytes
     */
    this.fileSize = function(path) {
        try {
            return fs.statSync(path)["size"];
        } catch (e) {
            return 0; // avoid hard links
        }
    };

    /**
     * @param {string} directory to get is size.
     * @returns {number} Directory size in bytes
     */
    this.directorySize = function(directory) {
        allFiles = new Array();
        traverseFileSystem(directory);

        var size = 0;
        for (var i = 0; i < allFiles.length; i++) {
            size += self.fileSize(allFiles[i]);
        }
        return size;
    };


    /**
     * @description Get an extension of fileName
     * @param {type} fileName to get its extension.
     * @returns {string} The extension of fileName
     */
    function getFileExtension(fileName) {
        var ext = path.extname(fileName || '').split('.');
        return ext[ext.length - 1];
    }

    this.countLinesInFile = function(file) {
        var ext = getFileExtension(file).toLowerCase();

        switch (ext) {
            // Images
            case 'bmp':
            case 'exif':
            case 'gif':
            case 'ico':
            case 'jfif':
            case 'jpeg':
            case 'pam':
            case 'pbm':
            case 'pfm':
            case 'pgm':
            case 'png':
            case 'pnm':
            case 'xcf':

            case 'raw':
            case 'tiff':
            case 'webp':
                // Others
            case 'ds_store':
            case 'gz':
            case 'class':
            case 'eot':
            case 'jar':
            case 'ttf':
            case 'woff':
                return 0;
        }
        var stats = fs.lstatSync(file);
        if (stats.isSymbolicLink())
            return 0;

        var content = fs.readFileSync(file, 'utf8');

        return content.split('/n').length;
    };

    this.countLinesInFolder = function(directory) {
        allFiles = new Array();
        traverseFileSystem(directory);

        var lines = 0;
        for (var i = 0; i < allFiles.length; i++) {
            lines += self.countLinesInFile(allFiles[i]);
        }
        return lines;
    };
}





module.exports.createLineCounter = function() {
    return new LineCounter();
};


