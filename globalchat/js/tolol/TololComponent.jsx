/**
 * Created by Vincentius on 5/4/2016.
 */

var Header = React.createClass({
    render: function () {
        return(
            <div className="row">
                <div className="col-lg-12">
                    <h1>Global Chat #{Date.now() % 103723 + 1}</h1>
                </div>
            </div>
        );
    }
});

var ChatText = React.createClass({
    mixins: [Reflux.connect(window.productStore, "data")],
    sendMessage: function () {
        var textInput = $("#textMessage");
        window.actions.sendChat(this.state.data.myIp, textInput.val(), "ME");
        textInput.val("");
    },
    onKeyDown: function (e) {
        if (e.keyCode == 13) {
            this.sendMessage();
        }
    },
    render: function () {
        var chats = this.state.data.chat;
        chats = chats.map(function (chat) {
            if (chat.type == "JOIN")
                return (
                    <span style={{"display": "block"}}><strong
                        style={{"color": "green"}}>{chat.username} </strong><span
                        style={{"color": "grey"}}><i><b>{chat.message}</b></i></span></span>
                );
            if (chat.type == "LEFT")
                return (
                    <span style={{"display": "block"}}><strong
                        style={{"color": "red"}}>{chat.username} </strong><span
                        style={{"color": "grey"}}><i><b>{chat.message}</b></i></span></span>
                );
            return(
                <span style={{"display": "block"}}><strong
                    style={{"color": "blue"}}>{chat.username} </strong>{chat.message}</span>
            );
        });
        return (
            <div className="col-lg-8 card" style={{"height": "500px"}}>
                <div className="card-block">
                    <div className="row" style={{"height": "420px"}}>
                        <div className="col-lg-12">
                            {chats}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="input-group">
                                <input id="textMessage" maxLength="50" type="text" className="form-control"
                                       placeholder="Type Here ..." onKeyDown={this.onKeyDown}/>
                                <span className="input-group-btn">
                                    <button onClick={this.sendMessage} className="btn btn-secondary"
                                            type="button">Send</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var UserSection = React.createClass({
    mixins: [Reflux.connect(window.productStore, "data")],
    render: function () {
        var userCount = this.state.data.people.length;
        var ips = this.state.data.people;
        ips = ips.map(function (ip) {
            return(
                <span style={{"display": "block"}}><strong style={{"color": "green"}}>{ip}</strong></span>
            );
        });
        return (
            <div className="col-lg-4 card" style={{"height": "500px"}}>
                <div className="card-block">
                    <div className="row">
                        <div className="col-lg-12 text-xs-center">
                            <h4>Your IP : <strong>{this.state.data.myIp}</strong></h4>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-xs-12">
                            <h5>User Online : <strong>{userCount}</strong></h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            {ips}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ChatSection = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="card-group">
                    <ChatText />
                    <UserSection />
                </div>
            </div>
        );
    }
});

var Application = React.createClass({
    render: function () {
        return(
            <div className="container" style={{"marginTop": "30px"}}>
                <Header />
                <ChatSection />
            </div>
        );
    }
});

React.render(
    <Application />,
    document.getElementById("main")
);