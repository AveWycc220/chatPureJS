import Basement from '../base'

export default class NameDiv extends Basement {
  init() {
    this.mainBasement.id = 'name'
  }

  events() {

  }

  render() {
    return this.cookieWorker.getCookie('name')
  }
}