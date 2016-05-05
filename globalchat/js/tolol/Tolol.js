/**
 * Created by Vincentius on 5/5/2016.
 */

$(document).ready(function () {
    getIp();
    setInterval( function() {
        brain();
    }, 1023);
    setInterval( function () {
        if (Math.random() >= 0.7)
            window.actions.sendBotChat();
    }, 500);
});

function getIp() {
    $.ajax({
        url: "https://api.ipify.org/?format=json",
        method: "GET"
    }).done(function (data) {
        window.actions.setMyIp(data.ip);
    });
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function brain() {
    /**
     * 80% Chance that we do the action
     */
    if (Math.random() > 0.2) {

        var chance = Math.random();
        if (chance <= 0.8) {
            var IP = getRandomIntInclusive(0, 255) + "." + getRandomIntInclusive(0, 255) + "." + getRandomIntInclusive(
                    0, 255) + "." + getRandomIntInclusive(0, 255);
            window.actions.addPeople(IP);
        } else {
            window.actions.removePeople();
        }

    }
}