Date.prototype.toIsrealFormat = function() {
    return this.getDay() + '/' + this.getMonth() + '/' + this.getFullYear();
};

angular.module('commentsHandler', ['HebUtill'
]).factory('commentsHandler', function(HebUtill) {
    "use strict";
    /**
     * @constructor
     * @requires HebUtill
     */
    var commentsHandler = function() {

        this.treatComments = function(list) {
            HebUtill.addLanguageAttribute(list);
            for (var i = 0; i < list.length; i++) {
                var comm = list[i];
                comm.timeSince = this.timeSince(comm.created_at);
                var d = new Date(comm.created_at);
                comm.israelFormatCreated_at = d.toIsrealFormat();
            }
        };

        /**
         * @description Format a JavaScript Date as a string stating the time elapsed.
         * @param {string} dateText Unix time format.
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

        var getRapoName = function(issue) {
            var url = issue.html_url.split('/');
            var name = url[url.length - 3];

            switch (name.toLowerCase()) {
                case "anyway":
                    return 'anyway';
                case "open-knesset":
                    return "כנסת פתוחה";
                case "hasadna.github.io":
                    return "ארץ החשמבירים";
                case "opencommunity":
                    return "קהילה פתוחה";
                case "openpension":
                    return "פנסיה פתוחה";
                case "alaveteli":
                    return "תביא ת'דאטה";
                case "openmuni-budgets":
                case "open-budget":
                    return  "התקציב המקומי הפתוח";
                case "NeuroNet":
                    return  "הגשמה ציבורית";
                case "obudget":
                    return  "התקציב הפתוח";
                case "openlaw-bot":
                    return "ספר החוקים";
                case "opentaba-server":
                    return  "תבע פתוחה";

                case "openpress":
                case "okscraper":
                case "okscraper-django":
                    return name;
                default :
                    window.console.error('' + name);
                    return name;
            }
        };

        var getInnerLinkFromIssue = function(issue) {
            var url = issue.html_url.split('/');
            var name = url[url.length - 3].toLowerCase();
            for (var i = 0; i < eKnightsData.length; i++) {
                if (eKnightsData[i].github_repo.toLowerCase().search(name) !== -1) {
                    return eKnightsData[i].slug;
                }
            }
            return false;
        };

        /**
         *  @description Add repoName  and eKnightSlug to each issue
         * @param {Array<Object>} list of issues
         * @returns {undefined}
         */
        this.addRapoAttribute = function(list) {
            for (var i = 0; i < list.length; i++) {
                var issue = list[i];
                issue.repoName = getRapoName(issue);
                issue.eKnightSlug = getInnerLinkFromIssue(issue);
            }
        };

    };
    return new commentsHandler();
});
