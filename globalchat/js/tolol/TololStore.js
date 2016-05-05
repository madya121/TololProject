/**
 * Created by Vincentius on 5/4/2016.
 */

var SESSION = "NOW_IS_" + Date.now();
var bot = new cleverbot("GOm6gEzorisYxm18", "Jomk4LzABfYpUHcOlUbbtt5jqpavPYNo");
bot.setNick(SESSION);

(function (Reflux, actions, global) {
    global.productStore = Reflux.createStore({
        listenables: [actions],
        sendMessageUseBot: function (message) {
            var self = this;
            if (Math.random() > 0.5) {
                bot.ask(message, function (err, response) {
                    self.onSendBotChat(response);
                });
            }
        },
        onSendChat: function (username, message, type) {
            var data = this.data;

            if (data.myIp == null && type == "ME")
                message = "Not Connected";
            if (data.myIp == null)
                return;

            data.chat = data.chat.concat({
                username: username,
                message: message,
                type: type
            });
            if (data.chat.length > 17) {
                data.chat.splice(0, 1);
            }
            if (type == "ME") {
                this.sendMessageUseBot(message);
            }
            this.updateData(data);
        },
        onSetMyIp: function (ip) {
            var data = this.data;
            data.myIp = ip;
            data.people = data.people.concat(ip);
            this.updateData(data);
        },
        onAddPeople: function (ip) {
            var data = this.data;
            if (data.people.length == 15)
                return;
            data.people = data.people.concat(ip);
            this.onSendChat(ip, "JOIN THE ROOM", "JOIN");
            this.updateData(data);
        },
        onRemovePeople: function () {
            var data = this.data;
            var randomIndex = Date.now() % data.people.length;
            if (data.people[randomIndex] == data.myIp)
                return;

            this.onSendChat(data.people[randomIndex], "LEFT THE ROOM", "LEFT");
            data.people.splice(randomIndex, 1);
            this.updateData(data);
        },
        onSendBotChat: function (message) {
            var data = this.data;
            var randomIndex = Date.now() % data.people.length;
            if (data.people[randomIndex] == data.myIp)
                return;
            var messagesIndex = Date.now() % messages.length;
            this.onSendChat(data.people[randomIndex], (message) ? message : messages[messagesIndex], "CHAT");
        },
        updateData: function(data){
            this.data = data;
            this.trigger(this.data);
        },
        getInitialState: function() {
            this.data = {
                chat: [],
                people: [],
                myIp: null
            };

            return this.data;
        }
    });
})(window.Reflux, window.actions, window);