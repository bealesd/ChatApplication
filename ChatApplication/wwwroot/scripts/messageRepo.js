function MessageRepo() {
    function main() {
        return {
            init: function () {
                localStorage.setItem("newMessagesCount", "0");
            },

            getPrevious10Messages: function () {
                if (document.querySelectorAll("#messagesContainer > div").length === 0) return;

                firstMessageId = document.getElementById("messagesContainer").children[0].dataset.id;
                RestHelper().get(`Chat/GetTenChatsBeforeId?firstClientId=${firstMessageId}`).then(function (results) {
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
                return RestHelper().get("GetMessages?recordCount=10").then(function (results) {
                    console.log(`\nGetting last 10 messages ${Date()}.`);
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
                return RestHelper().get(`GeNewMessages?lastId=${lastMessageId}`).then(function (results) {
                    console.log(`\nGetting new messages after id ${lastMessageId} on ${Date()}.`);
                    if (results.length > 0) {
                        let dict = {};
                        for (let i = 0; i < results.length; i++) {
                            let id = results[i].id;
                            if (dict[`${id}`] === undefined) {
                                dict[`${id}`] = "";
                                let messageNode = this.createMessageNode(results[i]);
                                if (messageNode !== null) document.getElementById("messagesContainer").innerHTML += messageNode;
                            }
                        }
                        lastMessageId = results[results.length - 1]['id'];
                        ChatHelper().scrollToBottom("messagesContainer");

                        localStorage.setItem("newMessagesCount", `${(parseInt(localStorage.getItem("newMessagesCount")) + 1)}`);
                    }
                    document.querySelectorAll("#messageControlsResponse > p")[0].innerHTML = `new messages: ${localStorage.getItem("newMessagesCount")}`;

                }.bind(this));
            },

            createMessageNode: function (message) {
                if (message === null || message['who'] === null) return null;
                let messageDateTime = new Date(message['datetime']);

                let messageNode =
                    `<div data-id=${message['id']} class="${message['who'].toLowerCase()} messageNode">
                        <p class="dateTime">${messageDateTime.toUTCString()}</p>
                        <p class="${message['who'].toLowerCase()}Message">${message['content']}</p>
                    </div>`;
                return messageNode;
            },

        };
    }
    return main();
}