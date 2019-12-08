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
        CoreHelper.loadLibrary();
        this.setupEmojis();

        this.loadChats();
        this.registerChatEvents();
        this.startNewMessagesWorker(10000);
        this.setTheme(this.usernameElement.value);
        this.userInputChatMessageElement.focus();
    }

    setupEmojis() {
        const emojiContainerElement = document.querySelector("#emojiContainer");
        const emojiCharLeft = String.fromCharCode(55357);
        const emojiObjects = {
            "happy": emojiCharLeft + String.fromCharCode(56898),
            "flat": String.fromCharCode(55357) + String.fromCharCode(56848),
            "unsure": String.fromCharCode(55357) + String.fromCharCode(56853),
            "sad": String.fromCharCode(55357) + String.fromCharCode(56863),
            "cheeky": String.fromCharCode(55357) + String.fromCharCode(56859),
            "sadTear": String.fromCharCode(55357) + String.fromCharCode(56866),
            "angry": String.fromCharCode(55357) + String.fromCharCode(56864)
        };
        Object.keys(emojiObjects).forEach((key) => {
            emojiContainerElement.innerHTML += `<a id="${key}">${emojiObjects[key]}</a>`;
        });

        Object.keys(emojiObjects).forEach((key) => {
            document.querySelector(`#${key}`).addEventListener("click", (event) => {
                const id = event.srcElement.id;
                document.querySelector('#chatMessage').value += `${emojiObjects[id]}`;
            });
        });
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