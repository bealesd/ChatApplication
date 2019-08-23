function Chat() {
    this.lastMessageId = null;
    this.firstMessageId = null;

    function main() {
        return {
            init: function (firstMessageId, lastMessageId) {
                this.firstMessageId = firstMessageId;
                this.lastMessageId = lastMessageId;
                this.messageRepo = MessageRepo();
                this.messageRepo.init();
                this.chatHelper = ChatHelper();
                this.restHelper = RestHelper();
                this.setTheme(document.getElementById("setUsername").value);
            },

            onLoad: function () {
                this.loadChats();
                this.registerChatEvents();
                this.startNewMessagesWorker(10000);
                document.getElementById('chatMessage').focus();
            },

            loadChats: function () {
                this.messageRepo.getLast10Messages().then(function () {
                    this.chatHelper.scrollToBottom("messagesContainer");
                }.bind(this));
            },

            registerChatEvents: function () {
                this.registerGetPrevious10MessagesButton();
                this.registerGetNewMessagesButton();
                this.setupChatInputBox();
                this.setThemeForUsername();
                this.registerTabSwitch();
            },

            setThemeForUsername: function () {
                document.getElementById("setUsername").addEventListener("change", function (event) {
                    let username = event.srcElement.value;
                    this.setTheme(username);
                    document.getElementById("chatMessage").focus();
                }.bind(this), false);

            },

            setTheme: function (username) {
                if (username === "David") {
                    document.getElementsByTagName('body')[0].style.backgroundColor = 'black';
                }
                else {
                    document.getElementsByTagName('body')[0].style.backgroundColor = "white";
                }
            },

            startNewMessagesWorker: function (interval) {
                var intervalID = window.setInterval(function () {
                    this.messageRepo.getNewMessages();
                    document.querySelectorAll("#chatMessage")[0].value = "";
                }.bind(this), interval);
            },

            registerGetPrevious10MessagesButton: function () {
                $('#previous10MessagesButton').click(function () {
                    this.firstMessageId = this.messageRepo.getPrevious10Messages();
                }.bind(this));
            },

            registerGetNewMessagesButton: function () {
                $('#newMessagesButton').click(function () {
                    this.firstMessageId = this.messageRepo.getNewMessages();
                }.bind(this));
            },

            setupChatInputBox: function () {
                $("#chatMessage").on("keydown", function () {
                    this.chatHelper.updateMessageBox('chatMessage');
                }.bind(this));

                $("#submitMessageButton").on("click", function (event) {
                    this.chatHelper.validateAndSendChatMessage("chatMessage");
                }.bind(this));
            },

            registerTabSwitch: function () {
                $(window).blur(function () {
                    localStorage.setItem("newMessagesCount", "0");
                });
            }
        };
    }
    return main();
}
