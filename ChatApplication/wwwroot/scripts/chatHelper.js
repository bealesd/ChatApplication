function ChatHelper() {
    function main() {
        return {
            validateAndSendChatMessage: function (id) {
                let chatMessage = document.getElementById(id).value;
                if (!chatMessage.trim() || chatMessage.trim() === "" || chatMessage === null || chatMessage === undefined) {
                    alert("no message enterred");
                }
                else {
                    var username = document.getElementById("setUsername").value;
                    if (username === null) return;
                    new RestHelper().postMessage(chatMessage, username).then(function (res) {
                        console.log(res);
                        new MessageRepo().getNewMessages();
                    }.bind(this));
                }
            },

            scrollToBottom: function (id) {
                var element = document.getElementById(id);
                if (element.scrollHeight - element.clientHeight > 0) {
                    element.scrollTop = element.scrollHeight - element.clientHeight;
                }
            },

            updateMessageBox: function (chatMessage) {
                var text = document.getElementById(chatMessage);
                text.style.height = 'auto';
                text.style.height = text.scrollHeight + 'px';
            },
        };
    }
    return main();
}