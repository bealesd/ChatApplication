import { RestHelper } from './restHelper.js';
import { ChatHelper } from './chatHelper.js';
import { CoreHelper } from './coreHelper.js';

export class MessageRepo {
    lastMessageId = '';
    messagesContainerId = 'messagesContainer';
    messageControlsResponseId = 'messageControlsResponse';

    constructor() {
        if (!MessageRepo.instance) {
            MessageRepo.instance = this;

            this.restHelper = new RestHelper(window.ChatUrlPrefix);
            ChatHelper.setMessageCount(0);

            this.messageContainerElement = document.querySelector(`#${this.messagesContainerId}`);
            this.messageControlsResponseElement = document.querySelector(`#${this.messageControlsResponseId} > p`);
        }
        return MessageRepo.instance;
    }

    postMessage(message, username) {
        const json = {
            'Message': `${message}`,
            'Username': `${username}`
        };
        this.restHelper.postJson('postMessage', json).then(function (result) {
            console.log(result);
            let messageNode = ChatHelper.createMessageNode(result);
            if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
            this.lastMessageId = result.Id;
            ChatHelper.scrollToBottom(this.messageContainerElement);

            ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);
            ChatHelper.clearMessageBox();
        }.bind(this))
            .catch(function (error) {
                console.log('Post failed', error);
            });
    }

    getLast10Messages() {
        return this.restHelper.get("GetMessages?recordCount=10")
            .then((results) => {
                console.log(`\nGetting last 10 messages ${Date()}.`);
                if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        let messageNode = ChatHelper.createMessageNode(results[i]);
                        if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
                    }
                    this.lastMessageId = results[results.length - 1]['Id'];
                }
                else this.messageControlsResponseElement.innerHTML = "no messages";
            })
            .catch(function (error) {
                console.log('Request failed', error);
            });
    }

    getNewMessages() {
        const getQuery = `GeNewMessages?lastId=${this.lastMessageId}`;
        if (!CoreHelper.isNotEmptyString(this.lastMessageId)) { return; }
        return this.restHelper.get(getQuery).then(function (results) {
            if (results.length > 0) {

                let dict = {};
                for (let i = 0; i < results.length; i++) {
                    let id = results[i].Id;
                    if (dict[`${id}`] === undefined) {
                        dict[`${id}`] = "";
                        let messageNode = ChatHelper.createMessageNode(results[i]);
                        if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
                    }
                }
                this.lastMessageId = results[results.length - 1]['Id'];
                ChatHelper.scrollToBottom(this.messageContainerElement);

                ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);
            }

            ChatHelper.updateMessageCountElement();
        }.bind(this));
    }
}