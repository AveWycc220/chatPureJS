import Basement from '../base'

export default class LogoutButton extends Basement {
  init() {
    this.mainBasement.id = 'log-out'
    this.mainBasement.title = 'LogOut'
  }

  events() {
    this.mainBasement.addEventListener('click',  () => {
      this.apiWorker.logout()
    })
  }

  render() {
    return ''
  }
}