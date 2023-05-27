import { AssToMs, convertSRTTags, msToAss } from './utils.js';
import stringify from 'ass-stringify';
import * as ass from './assTemplate.js';
function generateASSLine(line, styles) {
    let startMs = line.startTime;
    if (startMs < 0)
        startMs = 0;
    const stopMs = line.endTime;
    const dialogue = ass.getDialogue();
    dialogue.value.Start = msToAss(startMs);
    dialogue.value.End = msToAss(stopMs);
    dialogue.value.Text = line.text;
    dialogue.value.Style = styles.body[1].value.Name;
    return {
        dialogue,
    };
}
function sortStartTime(a, b) {
    if (a.value.Start < b.value.Start)
        return -1;
    if (a.value.Start > b.value.Start)
        return 1;
    return 0;
}
export function parseSRT(srt) {
    const rawArr = srt.replace(/\r/g, '').split('\n');
    const ass = [];
    let subSegment = {
        startTime: 0,
        endTime: 0,
        text: ''
    };
    let insideSubSegment = false;
    let sub = [];
    for (const line of rawArr) {
        if (+line > 0 && !insideSubSegment) {
            insideSubSegment = true;
            continue;
        }
        if (line.match(/\d+:\d\d:\d\d,\d\d\d --> \d+:\d\d:\d\d,\d\d\d/)) {
            const startTime = line.split(' --> ')[0].replace(/,/g, '.');
            const endTime = line.split(' --> ')[1].replace(/,/g, '.');
            subSegment.startTime = AssToMs(startTime);
            subSegment.endTime = AssToMs(endTime);
            continue;
        }
        if (line === '') {
            subSegment.text = sub.join('\\n');
            ass.push(subSegment);
            subSegment = {
                startTime: 0,
                endTime: 0,
                text: ''
            };
            insideSubSegment = false;
            sub = [];
            continue;
        }
        sub.push(convertSRTTags(line));
    }
    if (insideSubSegment) {
        subSegment.text = sub.join('\\n');
        ass.push(subSegment);
    }
    return ass;
}
export function convertToASS(text) {
    const sub = parseSRT(text);
    const dialogues = [];
    const styles = ass.getStyles();
    for (const line of sub) {
        const ASSLines = generateASSLine(line, styles);
        dialogues.push(ASSLines.dialogue);
    }
    dialogues.sort(sortStartTime);
    const events = ass.getEvents();
    events.body = events.body.concat(dialogues);
    return stringify([ass.scriptInfo, styles, events]);
}
//# sourceMappingURL=index.js.map
