
/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_start_angle(d, ref) {
    if (ref) {
        var ref_span = ref.stop_deg - ref.start_deg;
        return (d.start_deg - ref.start_deg) / ref_span * Math.PI * 2.0;
    } else
        return d.start_deg;
}
/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_stop_angle(d, ref) {
    if (ref) {
        var ref_span = ref.stop_deg - ref.start_deg;
        return (d.stop_deg - ref.start_deg) / ref_span * Math.PI * 2.0;
    } else
        return d.start_deg;
}
/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_level(d, ref) {
    if (ref)
        return d.level - ref.level;
    else
        return d.level;
}





function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh)
        return bytes + ' B';
    if (si)
        var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    else
        var units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
}

