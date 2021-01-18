import Basement from '../base'

export default class MessageList extends Basement {
  init(){
    this.mainBasement.id = 'message-list'
    this.lastId = undefined
  }

  events(){
    document.addEventListener('messageList', () => {
      this._readMessages()
    })
    document.addEventListener('messageSend', () => {
      this.mainBasement.innerHTML = ''
      this._readMessages()
    })
    document.addEventListener('messageDelete', () => {
      this.mainBasement.innerHTML = ''
      this._readMessages()
    })
    document.addEventListener('messageEdit', () => {
      this.mainBasement.innerHTML = ''
      this._readMessages()
    })
  }

  render() {
    if (this.apiWorker.messageList.length) {
      const btnList = ` <div class="btn-list">
                            ${this.childComponents.editButton.HTML}
                            ${this.childComponents.deleteButton.HTML}
                        </div>`
      const message = document.createElement('div')
      message.classList.add('message')
      message.id = this.lastId
      const isMyMessage = this.cookieWorker.getCookie('name') === this.stat[this.lastId].name
      isMyMessage ? message.classList.add('my') : message.classList.add('someone')
      message.innerHTML =
        `<div class="control"> 
             <p class="nickname">${this.stat[this.lastId].name}</p>
             ${isMyMessage ? btnList : ''}
           </div>
           <p class="time">
              ${new Date(+this.stat[this.lastId].time).toString().split(' ').slice(1, 5).join(' ')}
           </p>
           <p class="message-text">${this.stat[this.lastId].message}</p>`
      return message
    }
    return ''
  }

  _readMessages() {
    this.apiWorker.messageList.forEach((item) => {
      this.lastId = item.id
      this.stat[item.id] = item
    })
  }
}