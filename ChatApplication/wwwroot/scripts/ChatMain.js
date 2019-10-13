import { ChatHelper } from './chatHelper.js';
import { MessageRepo } from './messageRepo.js';
import { CoreHelper } from './coreHelper.js';

/**
 * ChatMain, setups the chat application
 */
export class ChatMain {

    lastMessageId = null;
    firstMessageId = null;

    //dom elemnent ids
    usernameId = "username";
    userInputChatMessageId = 'chatMessage';
    messagesContainerId = 'messagesContainer';
    submitMessageButtonId = 'submitMessageButton';

    constructor(firstMessageId, lastMessageId) {
        this.chatHelper = new ChatHelper();
        this.messageRepo = new MessageRepo();

        this.firstMessageId = firstMessageId;
        this.lastMessageId = lastMessageId;

        this.usernameElement = document.querySelector(`#${this.usernameId}`);
        this.userInputChatMessageElement = document.querySelector(`#${this.userInputChatMessageId}`);
        this.messageContainerElement = document.querySelector(`#${this.messagesContainerId}`);
        this.submitMessageButtonElement = document.querySelector(`#${this.submitMessageButtonId}`);
        this.bodyStyle = document.querySelector('body').style;
    }

    onLoad() {
        this.loadChats();
        this.registerChatEvents();
        this.startNewMessagesWorker(10000);
        this.setTheme(this.usernameElement.value);
        this.userInputChatMessageElement.focus();
    }

    loadChats() {
        this.messageRepo.getLast10Messages().then(function () {
            ChatHelper.scrollToBottom(this.messagesContainerId);
        }.bind(this));
    }

    registerChatEvents() {
        this.setupChatInputBox();
        this.setThemeForUsername();
        this.registerTabSwitch();
    }

    setThemeForUsername() {
        this.usernameElement.addEventListener("change", function (event) {
            let username = event.srcElement.value;
            this.setTheme(username);
        }.bind(this), false);
    }

    setTheme(username) {
        if (username === "David") this.bodyStyle.backgroundColor = 'black';
        else this.bodyStyle.backgroundColor = "white";
    }

    startNewMessagesWorker(interval) {
        window.setInterval(function () {
            this.messageRepo.getNewMessages();
        }.bind(this), interval);
    }

    setupChatInputBox() {
        this.submitMessageButtonElement.addEventListener("click", function () {
            if (CoreHelper.isNotEmptyString(this.userInputChatMessageElement.value)) {
                this.messageRepo.postMessage(this.userInputChatMessageElement.value, this.usernameElement.value);
            }
            else alert('No message entered!');
        }.bind(this));
    }

    registerTabSwitch() {
        $(window).blur(function () {
            ChatHelper.setMessageCount(0);
            ChatHelper.updateMessageCountElement();
        }.bind(this));
    }
}