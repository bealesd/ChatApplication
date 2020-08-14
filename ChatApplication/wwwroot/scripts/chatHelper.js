import { CoreHelper } from './coreHelper.js';

export class ChatHelper {
    constructor() {
        //local storage
        ChatHelper.newMessagesCountKey = 'newMessagesCount';
        ChatHelper.messageControlsResponseId = 'messageControlsResponse';
        ChatHelper.chatMessage = 'chatMessage';
    }
    static updateMessageCountElement() {
        const messageControlsResponseElement = document.querySelector(`#${ChatHelper.messageControlsResponseId} > p`);
        messageControlsResponseElement.innerHTML = `new messages: ${ChatHelper.getMessageCount()}`;
    }

    static updateMessageBox() {
        let textElement = document.querySelector(`#${ChatHelper.chatMessage}`);
        textElement.style.height = textElement.scrollHeight + 'px';
    }

    static clearMessageBox() {
        let textElement = document.querySelector(`#${ChatHelper.chatMessage}`);
        textElement.value = ''
    }

    static createMessageNode(messageObject) {
        const messagesProperties = ['Id', 'Who', 'Datetime', 'Content'];
        //if (!CoreHelper.hasProperiesOfStringOrNumberOnly(messageObject, messagesProperties)) return null;

        const messageDateTime = new Date(messageObject['datetime']);
        return `<div data-id=${messageObject['id']} class="${messageObject['who'].toLowerCase()} messageNode">
                        <p class="dateTime">${messageDateTime.toUTCString()}</p>
                        <p class="${messageObject['who'].toLowerCase()}Message">${messageObject['content']}</p>
                </div>`;
    }

    static scrollToBottom(htmlMessagesContainer) {
        if (htmlMessagesContainer.scrollHeight - htmlMessagesContainer.clientHeight > 0) {
            htmlMessagesContainer.scrollTop = htmlMessagesContainer.scrollHeight - htmlMessagesContainer.clientHeight;
        }
    }

    static getMessageCount() {
        return localStorage.getItem(this.newMessagesCountKey);
    }

    static setMessageCount(count) {
        localStorage.setItem(this.newMessagesCountKey, `${count}`);
    }
}
