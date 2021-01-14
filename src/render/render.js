export default class DOMRender {
  nodeMessages = undefined

  constructor(cookieWorker) {
    this.userName = cookieWorker.getCookie('name')
  }

  showInput(input) {
    input.style.display = 'block'
    input.style.border = '2px solid red'
  }

  showDiv(div) {
    div.style.display = 'block'
  }

  renderName(userNameFiled) {
    userNameFiled.innerHTML = this.userName
  }

  restyleForm(form, signin=false) {
    if (!form[0].value) {
      form[0].style.border = '2px solid red'
    } else {
      form[0].style.border = '2px solid black'
    }
    if (!form[1].value) {
      form[1].style.border = '2px solid red'
    } else {
      form[1].style.border = '2px solid black'
    }
    if (signin) {
      if (!form[2].value) {
        form[2].style.border = '2px solid red'
      } else {
        form[2].style.border = '2px solid black'
      }
    }
  }

  renderMessage(objMessage, node=undefined) {
    if (node) {
      this.nodeMessages = document.querySelector(node)
    }
    if (this.nodeMessages) {
      const message = document.createElement('div')
      const btnList = `<div class="btn-list">
                            <button id="edit"></button>
                            <button id="delete"></button>
                       </div>`
      const isMyMessage = objMessage.name === this.userName
      message.classList.add('message')
      isMyMessage ? message.classList.add('my') : message.classList.add('someone')
      message.innerHTML = `<div class="control"> 
                                <p class="nickname">${objMessage.name}</p>
                                ${isMyMessage ? btnList : ''}
                            </div>
                            <p class="time">${new Date(+objMessage.time).toString().split(' ').slice(1, 5).join(' ')}</p>
                            <p class="message-text">${objMessage.message}</p>`
      this.nodeMessages.append(message)
    }
  }
}
