import Basement from '../base'

export default class InfoDiv extends Basement {
  init() {
    this.mainBasement.classList.add('info')
    this.stat.info = ''
  }

  events() {
    document.addEventListener('userExist', e => {
      this.stat.info = e.type
    })
    document.addEventListener('wrongData', e => {
      this.stat.info = e.type
    })
  }

  render() {
    if (!this.stat.info) { return '' }
    else if (this.stat.info === 'userExist') { return 'User is Already Exist' }
    else if (this.stat.info === 'wrongData') { return 'Wrong Email or Password' }
  }
}