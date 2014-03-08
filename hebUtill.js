

angular.module('HebUtill', []).factory('HebUtill', function() {

    /**
     * @constructor
     */
    function HebUtill() {

        /**
         * Use by the isHebrew method.
         * @private
         **/
        var hebrewPattern = new RegExp(/[\u0590-\u05FF]/);
        /**
         * @param {String} word
         * @returns {Boolean} <tt>true</tt> if <tt>word</tt> contain at list one 
         * hebrew character, otherwise return <tt>false</tt>.
         * @public
         */
        function isHebrew(word) {
            return hebrewPattern.test(word);
        }


        function isMostHebrew(text) {
            var arr = text.split(' ');
            var heb = 0;
            var en = 0;
            for (var i = 0; i < arr.length; i++) {
                if (isHebrew(arr[i]))
                    heb++;
                else
                    en++;
            }
            return heb > en;
        }

        /***
         * @description Add title_lang  and body_lang  attribute  with 'hebrew' Or 'english' values - for text alignment.
         * @param {Array} data 
         * @return description{Array} data 
         */
        this.addLanguageAttribute = function(data) {

            for (var i = 0; i < data.length; i++) {
                if (isMostHebrew(data[i].body))
                    data[i].body_lang = "hebrew";
                else
                    data[i].body_lang = "english";
                if (data[i].title !== undefined) {
                    if (isMostHebrew(data[i].title))
                        data[i].title_lang = "hebrew";
                    else
                        data[i].title_lang = "english";
                }
            }
            return data;
        };
    }
    return new HebUtill();
});