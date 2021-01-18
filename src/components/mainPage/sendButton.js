import Basement from '../base'

export default class SendButton extends Basement {
  init() {
    this.mainBasement.id = 'send'
    this.mainBasement.title = 'Send'
  }

  events() {
    const messageInput = document.querySelector('.textarea')
    this.mainBasement.addEventListener('click', () => {
      if (messageInput.textContent) { this.apiWorker.send(messageInput.textContent) }
      messageInput.textContent = ''
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.shiftKey !== true) {
        if (messageInput.textContent) { this.apiWorker.send(messageInput.textContent) }
        messageInput.textContent = ''
        e.preventDefault()
      }
    })
  }

  render() {
    return ''
  }
}