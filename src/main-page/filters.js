/**
 * @description Filter that takes items with empty name from ordered array and
 * places them at the end.
 */
App.filter("emptyToEnd", function emptyToEnd() {
    /** 
     * @param {Array} array
     * @param {string} key
     */
    return function(array, key) {
        if (!angular.isArray(array))
            return;
        var present = array.filter(function(item) {
            return item[key];
        });
        var empty = array.filter(function(item) {
            return !item[key];
        });
        return present.concat(empty);
    };
});

/**
 *@description Format a JavaScript Date as a string stating the time elapsed
 *@see http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 */
App.filter('hebTimeAgo', function timeAgo() {
    /**
     * @param {Dtae|null|undefined} time 
     * @return {string} 
     */
    return function(time) {
        if (typeof time === 'undefined')
            return 'לא ידוע';
        time = +new Date(time);
        var time_formats = [
            [60, 'שניות', 1], // 60
            [120, 'לפני דקה', 'בעד דקה מעכשיו'], // 60*2
            [3600, 'דקות', 60], // 60*60, 60
            [7200, 'לפני שעה', 'בעוד שעה מעכשיו'], // 60*60*2
            [86400, 'שעות', 3600], // 60*60*24, 60*60
            [172800, 'אתמול', 'מחר'], // 60*60*24*2
            [604800, 'ימים', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'לפני שבוע', 'בשבוע הבא'], // 60*60*24*7*4*2
            [2419200, 'שבועות', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'לפני חודש', 'בחודש הבא'], // 60*60*24*7*4*2
            [29030400, 'חודשים', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'לפני שנה', 'בשנה הבאה'], // 60*60*24*7*4*12*2
            [2903040000, 'שנים', 29030400] // 60*60*24*7*4*12*100, 60*60*24*7*4*12
                    //[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
                    //[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000;
        var token = 'לפני';
        var list_choice = 1;
        if (seconds === 0)
            return 'עכשיו';
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'מעכשיו';
            list_choice = 2;
        }
        var i = 0;
        var format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] === 'string')
                    return format[list_choice];
                else
                    return token + ' ' + Math.floor(seconds / format[2]) + ' ' + format[1];
            }
        return time;
    };
});