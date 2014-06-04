
/***
 * @description Module to parse the result of git log --numstat
 * @see man git log --numstat
 */


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
 * @returns {Object<total:<number>,files:<Array>}
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
        if (statArr[i].total)
            totalSum += statArr[i].total;
    }

    return {
        'total': totalSum
                // ,'files': statArr
    };
};


module.exports.parseNumStat = parseNumStat;
