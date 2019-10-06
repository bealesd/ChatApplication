﻿import { RestHelper } from './restHelper.js';
import { ChatHelper } from './chatHelper.js';

export class MessageRepo {
    lastMessageId = '';
    messagesContainerId = 'messagesContainer';
    messageControlsResponseId = 'messageControlsResponse';

    constructor() {
        if (!MessageRepo.instance) {
            MessageRepo.instance = this;

            this.restHelper = new RestHelper();
            ChatHelper.setMessageCount(0);

            this.messageContainerElement = document.querySelector(`#${this.messagesContainerId}`);
            this.messageControlsResponseElement = document.querySelector(`#${this.messageControlsResponseId} > p`);
        }
        return MessageRepo.instance;
    }

    postMessage(message, username) {
        this.restHelper.postMessage(message, username).then(function (res) {
            console.log(res);
            this.getNewMessages();
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

    getNewMessages() {
        return this.restHelper.get(`GeNewMessages?lastId=${this.lastMessageId}`).then(function (results) {
            console.log(`\nGetting new messages after id ${this.lastMessageId} on ${Date()}.`);
            if (results.length > 0) {
                let dict = {};
                for (let i = 0; i < results.length; i++) {
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
            }
            this.messageControlsResponseElement.innerHTML = `new messages: ${ChatHelper.getMessageCount()}`;

        }.bind(this));
    }
}