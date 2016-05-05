var window_focus=true;
$(window).focus(function(){
    window_focus = true;
}).blur(function(){
    window_focus = false;
});

$(document).ready(function(){
    var percentage = 0;
    var updateInterval = 100; //ms
    var timeToFull = 25*60; //second
    var timeToEmpty = 15*60; //second
    var totalWastedTime = 0;
    var sessionWastedTime = 0;

    if (localStorage.getItem("twt")) {
        totalWastedTime = parseInt(localStorage.getItem("twt"));
    }

    var batteryFill = $("#battery-fill");
    var chargeToggle = $("#charge-toggle");
    var swt = $("#swt");
    var twt = $("#twt");

    function changeBatteryValue() {
        if (chargeToggle.is(":checked") && window_focus) {
            percentage += 100.0 * updateInterval / (timeToFull * 1000);
            $(".thunder").addClass("active");
        } else {
            percentage -= 100.0 * updateInterval / (timeToEmpty * 1000);
            $(".thunder").removeClass("active");
        }
        percentage = Math.min(percentage, 100);
        percentage = Math.max(percentage, 0);
        if (percentage == 100) {
            chargeToggle.prop('checked', false);
        }
        refreshBatteryRender();
    }

    function refreshBatteryRender() {
        batteryFill.css("width", percentage+"%");
        var r = 100-percentage;
        batteryFill.css("background-color", "rgb(" + r + "%, " + percentage + "%, 0%)");
    }

    function formatTime(s) {
        var hours = parseInt( s / 3600 ) % 24;
        var minutes = parseInt( s / 60 ) % 60;
        var seconds = s % 60;

        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    }

    setInterval(function() {
        if (window_focus) {
            totalWastedTime ++;
            sessionWastedTime ++;
            swt.html(formatTime(sessionWastedTime));
            twt.html(formatTime(totalWastedTime));
            localStorage.setItem("twt", totalWastedTime);
        }
    }, 1000);

    setInterval(function(){
        changeBatteryValue();
    }, updateInterval);

    chargeToggle.click(function(){
        var toggleSound = new Audio('Toggle.mp3');
        toggleSound.play();
    });
});