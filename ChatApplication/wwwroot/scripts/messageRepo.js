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
        var json = {
            'Message': `${message}`,
            'Username': `${username}`
        };
        this.restHelper.postJson('postMessage', json).then(function (res) {
            console.log(res);

            //const id = res.substring(res.indexOf('Message posted: ') + 'Message posted: '.length)
            //this.getNewMessages(id);
            let messageNode = ChatHelper.createMessageNode(result);
            if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
            this.lastMessageId = result.id;
            ChatHelper.scrollToBottom(this.messageContainerElement);

            ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);
        }.bind(this));
    }

    getPrevious10Messages() {
        if (document.querySelectorAll(`#${this.messagesContainerId} > div`).length === 0) return;

        firstMessageId = this.messageContainerElement.children[0].dataset.id;
        this.restHelper.get(`Chat/GetTenChatsBeforeId?firstClientId=${firstMessageId}`).then(function (results) {
            if (results.length > 0) {
                for (let i = results.length - 1; i >= 0; i--) {
                    let messageNode = ChatHelper.createMessageNode(results[i]);
                    this.messageContainerElement.innerHTML = messageNode + this.messageContainerElement.innerHTML;
                }
            }
            else this.messageControlsResponseElement.innerHTML = "no older messages";
        }.bind(this));
        return firstMessageId;
    }

    getLast10Messages() {
        return this.restHelper.get("GetMessages?recordCount=10").then(function (results) {
            console.log(`\nGetting last 10 messages ${Date()}.`);
            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    let messageNode = ChatHelper.createMessageNode(results[i]);
                    if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
                }
                this.lastMessageId = results[results.length - 1]['id'];
            }
            else this.messageControlsResponseElement.innerHTML = "no messages";
        }.bind(this));
    }

    getNewMessages(id) {
        const getQuery = CoreHelper.isNotEmptyString(id) ? `GeNewMessages?lastId=${id}` : `GeNewMessages?lastId=${this.lastMessageId}`;
        //const update = CoreHelper.isNotEmptyString(id) ? true: false;
        return this.restHelper.get(getQuery).then(function (results) {

            let dict = {};
            for (let i = 1; i < results.length; i++) {
                let id = results[i].id;
                if (dict[`${id}`] === undefined) {
                    dict[`${id}`] = "";
                    let messageNode = ChatHelper.createMessageNode(results[i]);
                    if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
                }
            }
            this.lastMessageId = results[results.length - 1]['id'];
            ChatHelper.scrollToBottom(this.messageContainerElement);

            ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);

            //utter filth, dirty hack. get messages always return at least one result, we ignore that result if a post wasnt made
            //if (!update && results.length > 1) {//ignore first element
            //    let dict = {};
            //    for (let i = 1; i < results.length; i++) {
            //        let id = results[i].id;
            //        if (dict[`${id}`] === undefined) {
            //            dict[`${id}`] = "";
            //            let messageNode = ChatHelper.createMessageNode(results[i]);
            //            if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
            //        }
            //    }
            //    this.lastMessageId = results[results.length - 1]['id'];
            //    ChatHelper.scrollToBottom(this.messageContainerElement);

            //    ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);
            //}

            //else if (update && results.length === 1) {
            //    const result = results[0];
            //    let messageNode = ChatHelper.createMessageNode(result);
            //    if (messageNode !== null) this.messageContainerElement.innerHTML += messageNode;
            //    this.lastMessageId = result.id;
            //    ChatHelper.scrollToBottom(this.messageContainerElement);

            //    ChatHelper.setMessageCount(`${(parseInt(ChatHelper.getMessageCount()) + 1)}`);
            //}

            //else {
            //    // do nothing
            //}

            ChatHelper.updateMessageCountElement();
        }.bind(this));
    }
}