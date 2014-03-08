

Date.prototype.toIsrealFormat = function() {
    return this.getDay() + '/' + this.getMonth() + '/' + this.getFullYear();
};

angular.module('commentsHandler',
        ['HebUtill']).factory('commentsHandler', function(HebUtill) {
    /**
     * @constructor
     * @requires HebUtill
     */
    var commentsHandler = function() {

        this.treatComments = function(list) {
            "use strict";
            HebUtill.addLanguageAttribute(list);
            for (var i = 0; i < list.length; i++) {
                var comm = list[i];
                comm.timeSince = this.timeSince((comm.created_at));
                var d = new Date(comm.created_at);
                comm.israelFormatCreated_at = d.toIsrealFormat();

            }
        };

        /**
         * @description Dormat a JavaScript Date as a string stating the time elapsed.
         * @param {strund} dateText Unix time format.
         * @returns {String}
         */
        this.timeSince = function(dateText) {
            var date = new Date(dateText);
            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1)
                return interval + "years";

            interval = Math.floor(seconds / 2592000);
            if (interval > 1)
                return interval + " months";

            interval = Math.floor(seconds / 86400);
            if (interval >= 1)
                return interval + " days";

            interval = Math.floor(seconds / 3600);
            if (interval >= 1)
                return interval + " hours";

            interval = Math.floor(seconds / 60);
            if (interval > 1)
                return interval + " minutes";

            return Math.floor(seconds) + " seconds";
        };

    };
    return new commentsHandler();
}
);