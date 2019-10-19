import { CoreHelper } from './coreHelper.js';

export class ChatHelper {
    constructor() {
        //local storage
        ChatHelper.newMessagesCountKey = 'newMessagesCount';
        ChatHelper.messageControlsResponseId = 'messageControlsResponse';
    }
    static updateMessageCountElement() {
        const messageControlsResponseElement = document.querySelector(`#${ChatHelper.messageControlsResponseId} > p`);
        messageControlsResponseElement.innerHTML = `new messages: ${ChatHelper.getMessageCount()}`;
    }

    static updateMessageBox(chatMessage) {
        let textElement = document.querySelector(`#${chatMessage}`);
        textElement.style.height = textElement.scrollHeight + 'px';
    }

    static createMessageNode(messageObject) {
        const messagesProperties = ['Id', 'Who', 'Datetime', 'Content'];
        if (!CoreHelper.hasProperiesOfStringOrNumberOnly(messageObject, messagesProperties)) return null;

        const messageDateTime = new Date(messageObject['Datetime']);
        return `<div data-id=${messageObject['Id']} class="${messageObject['Who'].toLowerCase()} messageNode">
                        <p class="dateTime">${messageDateTime.toUTCString()}</p>
                        <p class="${messageObject['Who'].toLowerCase()}Message">${messageObject['Content']}</p>
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