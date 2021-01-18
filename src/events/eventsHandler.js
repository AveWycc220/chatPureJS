export default class EventsHandler{
  static getWrongDataEvent() {
    return new Event('wrongData')
  }

  static getUserAlreadyExistEvent() {
    return new Event('userExist')
  }

  static getCreateMessageListEvent() {
    return new Event('messageList')
  }

  static getSendMessageEvent() {
    return new Event('messageSend')
  }

  static getDeleteMessageEvent() {
    return new Event('messageDelete')
  }

  static getEditMessageEvent() {
    return new Event('messageEdit')
  }
}