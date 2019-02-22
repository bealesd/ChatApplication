function ChatHelper() {
    function main() {
        return {
            intialize: function () {
            },

            validateAndSendChatMessage: function (id) {
                var chatMessage = document.getElementById(id).value;
                if (!chatMessage.trim() || chatMessage.trim() === "" || chatMessage === null || chatMessage === undefined) {
                    alert("no message enterred");
                }
                else {
                    window.location.href = window.location.origin + `/Chat/SendChatMessage?chatMessage=${chatMessage}`;
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