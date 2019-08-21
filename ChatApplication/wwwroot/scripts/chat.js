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
                this.startNewMessagesWorker(5000);
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
                this.createMessageScrollEvents();
                this.setupChatInputBox();
                this.setThemeForUsername();
            },

            setThemeForUsername: function () {
                document.getElementById("setUsername").addEventListener("click", function (event) {
                    let username = event.srcElement.value;
                    this.setTheme(username);
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
                var intervalID = window.setInterval(function(){
                    this.messageRepo.getNewMessages();
                }.bind(this), interval);
                
               // setTimeout(function () {
                //    this.messageRepo.getNewMessages().then(function () {
                //        this.startNewMessagesWorker();
                //    }.bind(this));
               // }.bind(this), interval);
            },

            createMessageScrollEvents: function () {
                document.getElementById("messagesContainer").addEventListener('scroll', function () {
                    var curScrollPos = document.getElementById("messagesContainer").scrollTop;
                    if (curScrollPos === 0)
                        this.messageRepo.getPrevious10Messages();
                    if (document.getElementById("messagesContainer").scrollTop + document.getElementById("messagesContainer").clientHeight === document.getElementById("messagesContainer").scrollHeight) {
                        this.messageRepo.getNewMessages();
                    }
                }.bind(this));
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

                $("#chatMessage").on("keyup", function (event) {
                    //13 is enter
                    if (event.keyCode === 13) {
                        this.chatHelper.validateAndSendChatMessage("chatMessage");
                    }
                    document.getElementById("chatMessage").focus();
                }.bind(this));
            }
        };
    }
    return main();
}
