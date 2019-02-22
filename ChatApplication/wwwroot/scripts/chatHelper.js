function ChatHelper() {
    function main() {
        return {
            intialize: function () {
            },

            validateChatMessage: function (chatMessage) {
                if (!chatMessage.trim() || chatMessage.trim() === "" || chatMessage === null || chatMessage === undefined) {
                    alert("no message enterred");
                }
                else {
                    window.location.href = `/Chat/SendChatMessage?chatMessage=${chatMessage}`;
                }
            },
        };
    }
    return main();
}