const ndjson = require('ndjson');
const fs = require('fs');

let playerCount = 0;
let playtimeTotal = 0;
let actionsTotal = 0;
let actionMobileTotal = 0;
let actionDesktopTotal = 0;

fs.createReadStream('output1.json').pipe(ndjson.parse()).on('data', function(obj) {
    playerCount++;
    playtimeTotal += obj.onlineTimeInMin;
    actionsTotal += obj.actions;
    actionMobileTotal += obj.actionsMobile;
    actionDesktopTotal += obj.actionsDesktop;
    console.log('Total: ' + actionsTotal + ' Desktop: ' + actionDesktopTotal + ' Mobile: ' + actionMobileTotal);
    console.log('Player count: ' + playerCount + ' Playtime: ' + playtimeTotal);
});