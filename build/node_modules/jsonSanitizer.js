
/***
 *@description Sanitize JSON string before saving, so it can be read again. (Escapes newlines etc)
 * @param {string} unsanitized string
 * @returns {string} Sanitized string
 * @see https://gist.github.com/jamischarles/1046671
 */
function sanitize(unsanitized) {
    return unsanitized
            .trim()
            .replace(/\\/g, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f")
            .replace(/"/g, "\\\"") //.replace(/'/g,"\\\'")
            .trim();
}


module.exports.sanitize = sanitize;