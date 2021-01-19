import Basement from '../base'

export default class InfoDiv extends Basement {
  init() {
    this.mainBasement.classList.add('info')
    this.state.info = ''
  }

  events() {
    document.addEventListener('userExist', e => {
      this.state.info = e.type
    })
    document.addEventListener('wrongData', e => {
      this.state.info = e.type
    })
  }

  render() {
    if (!this.state.info) { return '' }
    else if (this.state.info === 'userExist') { return 'User is Already Exist' }
    else if (this.state.info === 'wrongData') { return 'Wrong Email or Password' }
  }
}