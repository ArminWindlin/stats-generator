const ndjson = require('ndjson');
const fs = require('fs');

// action structure
/*
    path: String
    device: String
    method: String
    timestamp: Timestamp
*/

// clear files
fs.writeFile('output1.json', '', function(err) {
    if (err) throw err;
});
fs.writeFile('output1.csv', '', function(err) {
    if (err) throw err;
});

fs.createReadStream('tracks.json').pipe(ndjson.parse()).on('data', function(obj) {
    let actionsMobile = 0;
    let actionsDesktop = 0;
    let onlineTime = 1;
    let onlineDays = 0;

    obj.actions[0].timestamp = new Date(obj.actions[0].timestamp['$date']);
    obj.actions[obj.actions.length - 1].timestamp = new Date(obj.actions[obj.actions.length - 1].timestamp['$date']);
    let startDate = obj.actions[0].timestamp;
    let endDate = obj.actions[obj.actions.length - 1].timestamp;
    let playPeriodInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < obj.actions.length; i++) {
        if (i === 0) continue;
        let a = obj.actions[i];
        let aPrev = obj.actions[i - 1];

        // track device
        if (a.device === 'mobile') actionsMobile++;
        if (a.device === 'desktop') actionsDesktop++;

        // track days
        a.timestamp = new Date(a.timestamp['$date']);
        if (a.timestamp.getDate() !== aPrev.timestamp.getDate()) onlineDays++;

        // track online time
        let minutes = a.timestamp.getMinutes() - aPrev.timestamp.getMinutes();
        if (minutes < 0) minutes = 60 - minutes;
        if (minutes > 10) minutes = 1;
        if (!isNaN(minutes)) onlineTime += minutes;
    }

    let daysOnlineInPercent = Math.round(onlineDays / playPeriodInDays * 100);
    if (daysOnlineInPercent > 100) daysOnlineInPercent = 100;

    let user = {
        actions: obj.actions.length,
        actionsMobile: actionsMobile,
        actionsDesktop: actionsDesktop,
        onlineTimeInMin: onlineTime,
        onlineDays: onlineDays,
        startDate: startDate,
        endDate: endDate,
        playPeriodInDays: playPeriodInDays,
        daysOnlineInPercent: daysOnlineInPercent,
    };

    fs.appendFile('output1.json', JSON.stringify(user) + '\n', function(err) {
        if (err) throw err;
    });

    fs.appendFile('output1.csv',
        obj.actions.length + ',' +
        actionsMobile + ',' +
        actionsDesktop + ',' +
        onlineTime + ',' +
        onlineDays + ',' +
        startDate + ',' +
        endDate + ',' +
        playPeriodInDays + ',' +
        daysOnlineInPercent + ',' +
        '\n', function(err) {
            if (err) throw err;
        });
});