import Basement from '../base'

export default class ButtonLogin extends Basement {
  init() {
    this.mainBasement.id = 'log-in'
  }

  events() {
    const form = document.querySelector('#keys')
    this.mainBasement.addEventListener('click', () => {
      this._login(form)
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this._login(form)
      }
    })
  }

  render() {
    return 'Log In'
  }

  _login(form) {
    if (form[0].value && form[1].value) {
      this.apiWorker.logIn(form, document.querySelector('.info'))
    }
  }
}