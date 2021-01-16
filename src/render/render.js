export default class DOMRender {
  nodeMessages = undefined

  constructor(cookieWorker) {
    this.userName = cookieWorker.getCookie('name')
  }

  showDiv(div) {
    div.style.display = 'block'
  }

  renderName(userNameFiled) {
    userNameFiled.innerHTML = this.userName
  }

  renderMessage(objMessage, node=undefined) {
    if (node) {
      this.nodeMessages = document.querySelector(node)
    }
    if (this.nodeMessages) {
      const message = document.createElement('div')
      const btnList = `<div class="btn-list">
                            <button class="edit""></button>
                            <button class="delete"></button>
                       </div>`
      const isMyMessage = objMessage.name === this.userName
      message.classList.add('message')
      message.id = objMessage.id
      isMyMessage ? message.classList.add('my') : message.classList.add('someone')
      message.innerHTML = `<div class="control"> 
                                <p class="nickname">${objMessage.name}</p>
                                ${isMyMessage ? btnList : ''}
                            </div>
                            <p class="time">${new Date(+objMessage.time).toString().split(' ').slice(1, 5).join(' ')}</p>
                            <p class="message-text">${objMessage.message}</p>`
      this.nodeMessages.prepend(message)
    }
  }

  rerenderMessage(objMessage) {
    document.getElementById(`${objMessage.id}`).querySelector('.message-text').innerHTML = objMessage.message
  }

  deleteMessage(objMessage) {
    document.getElementById(`${objMessage.id}`).remove()
  }

  showError(e) {
    if (e) {
      console.log(`Server-Error ${e}`)
      document.querySelector('.root').innerHTML = `Server-Error ${e}`
    } else {
      console.log('Server-Error')
      document.querySelector('.root').innerHTML = 'Server-Error'
    }
  }

  showInfo(info, message) {
    info.innerHTML = message
  }
}
