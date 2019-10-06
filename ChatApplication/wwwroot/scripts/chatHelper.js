export class ChatHelper {
    //local storage
    newMessagesCountKey = 'newMessagesCount';

    constructor() {
    }

    static isNotEmptyString(value) {
        return this.isString(value) && value.trim() !== "";
    }

    static isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }

    static updateMessageBox(chatMessage) {
        let textElement = document.querySelector(`#${chatMessage}`);
        textElement.style.height = textElement.scrollHeight + 'px';
    }

    static getMessageCount() {
        return localStorage.getItem(this.newMessagesCountKey);
    }

    static setMessageCount(count) {
        localStorage.setItem(this.newMessagesCountKey, `${count}`);
    }

    static scrollToBottom(htmlMessagesContainer) {
        if (htmlMessagesContainer.scrollHeight - htmlMessagesContainer.clientHeight > 0) {
            htmlMessagesContainer.scrollTop = htmlMessagesContainer.scrollHeight - htmlMessagesContainer.clientHeight;
        }
    }

    static isArray(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    }

    static isNumber(value) {
        return Object.prototype.toString.call(value) === "[object Number]";
    }

    static hasProperties(object, propertiesArray) {
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!this.hasProperty(object, value)) return false;
        }
        return true;
    }

    static hasProperiesOfStringOrNumberOnly(object, propertiesArray) {
        if (!this.hasProperties(object, propertiesArray)) return false;
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!this.isNumber(object[value]) === true && !this.isString(object[value]) === true) return false;
        }
        return true;
    }

    static hasProperty(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    }

    static createMessageNode(messageObject) {
        const messagesProperties = ['id', 'who', 'datetime', 'content'];
        if (!this.hasProperiesOfStringOrNumberOnly(messageObject, messagesProperties)) return null;

        const messageDateTime = new Date(messageObject['datetime']);
        return `<div data-id=${messageObject['id']} class="${messageObject['who'].toLowerCase()} messageNode">
                        <p class="dateTime">${messageDateTime.toUTCString()}</p>
                        <p class="${messageObject['who'].toLowerCase()}Message">${messageObject['content']}</p>
                </div>`;
    }
}