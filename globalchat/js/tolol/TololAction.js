/**
 * Created by Vincentius on 5/4/2016.
 */

(function (Reflux, global) {
    global.actions = Reflux.createActions([
        "sendChat",
        "addPeople",
        "removePeople",
        "setMyIp",
        "sendBotChat"
    ]);
})(window.Reflux, window);