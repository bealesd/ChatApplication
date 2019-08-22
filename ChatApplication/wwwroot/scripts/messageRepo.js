﻿function MessageRepo() {
    restHelper = null;
    function main() {
        return {
            init: function () {
                restHelper = RestHelper();
                this.chatHelper = ChatHelper();
                localStorage.setItem("newMessagesCount", "0");
            },

            getPrevious10Messages: function () {
                if (document.querySelectorAll("#messagesContainer > div").length === 0) return;

                firstMessageId = document.getElementById("messagesContainer").children[0].dataset.id;
                restHelper.get(`Chat/GetTenChatsBeforeId?firstClientId=${firstMessageId}`).then(function (results) {
                    if (results.length > 0) {
                        for (let i = results.length - 1; i >= 0; i--) {
                            let messageNode = this.createMessageNode(results[i]);
                            document.getElementById("messagesContainer").innerHTML = messageNode + document.getElementById("messagesContainer").innerHTML;
                        }
                    }
                    else document.querySelectorAll("#messageControlsResponse > p")[0].innerHTML = "no older messages";
                }.bind(this));
                return firstMessageId;
            },

            getLast10Messages: function () {
                return restHelper.get("Chat/GetLastTenChats").then(function (results) {
                    if (results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let messageNode = this.createMessageNode(results[i]);
                            document.getElementById("messagesContainer").innerHTML += messageNode;
                        }
                        lastMessageId = results[results.length - 1]['id'];
                    }
                    else document.querySelectorAll("#messageControlsResponse > p")[0].innerHTML = "no messages";
                }.bind(this));
            },

            getNewMessages: function () {
                return restHelper.get(`Chat/GetChatsAfterId?lastClientId=${lastMessageId}`).then(function (results) {
                    if (results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let messageNode = this.createMessageNode(results[i]);
                            document.getElementById("messagesContainer").innerHTML += messageNode;
                        }
                        lastMessageId = results[results.length - 1]['id'];
                        this.chatHelper.scrollToBottom("messagesContainer");

                        localStorage.setItem("newMessagesCount", `${(parseInt(localStorage.getItem("newMessagesCount")) + 1)}`);
                    }
                    document.querySelectorAll("#messageControlsResponse > p")[0].innerHTML = `new messages: ${localStorage.getItem("newMessagesCount")}`;
                }.bind(this));
            },

            createMessageNode: function (message) {
                let cSharpTicksFrom1900 = message['datetime'] / 10000;
                let jsTicksFrom1900To1970 = Math.abs(new Date(0, 0, 1).setFullYear(1));
                let messageDateTime = new Date(cSharpTicksFrom1900 - jsTicksFrom1900To1970);

                let messageNode =
                    `<div data-id=${message['id']} class="${message['who'].toLowerCase()}">
                        <p class="dateTime">${messageDateTime.toUTCString()}</p>
                        <p class="${message['who'].toLowerCase()}Message">${message['content']}</p>
                    </div>`;
                return messageNode;
            }

        };
    }
    return main();
}