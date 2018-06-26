class transferableMessage {
    constructor(messageStart, messageEnd, messageType, messageId, messageContent) {
        this.messageStart = messageStart;
        this.messageEnd = messageEnd;
        this.messageType = messageType;
        this.messageId = messageId;
        this.messageContent = messageContent;
    }
    setMessageContent(messageContent) {
        this.messageContent = messageContent;
    }
}