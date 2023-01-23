export function msToAss(ms) {
    const date = new Date(ms);
    const hour = date.getUTCHours();
    const hourStr = `${hour}`.padStart(2, '0');
    const min = date.getUTCMinutes();
    const minStr = `${min}`.padStart(2, '0');
    const sec = date.getUTCSeconds();
    const secStr = `${sec}`.padStart(2, '0');
    const mil = date.getUTCMilliseconds();
    const milStr = `${mil}`.padStart(3, '0');
    return `${hourStr}:${minStr}:${secStr}.${milStr.substr(0, 2)}`;
}
export function AssToMs(time) {
    const text = time.replace(/,/g, '.');
    const [hours, minutes, seconds] = text.split('.')[0].split(':');
    const miliseconds = text.split('.')[1];
    return +miliseconds + (+seconds * 1000) + (+minutes * 60 * 1000) + (+hours * 60 * 60 * 1000);
}
export function convertSRTTags(text) {
    return text
        .replace(/<b>|{b}/g, '{\\b1}')
        .replace(/<\/b>|{\/b}/g, '{\\b0}')
        .replace(/<i>|{i}/g, '{\\i1}')
        .replace(/<\/i>|{\/i}/g, '{\\i0}')
        .replace(/<u>|{u}/g, '{\\u1}')
        .replace(/<\/u>|{\/u}/g, '{\\u0}')
        .replace(/a\d/g, '')
        .replace(/<font color="\D+">/g, '')
        .replace(/<font>/g, '');
}
//# sourceMappingURL=utils.js.map