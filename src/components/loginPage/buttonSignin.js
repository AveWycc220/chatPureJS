import Basement from '../base'

export default class ButtonSignin extends Basement {
  init () {
    this.mainBasement.id = 'sign-in'
  }

  events() {
    const form = document.querySelector('#keys')
    let isUserInputVisible = false
    this.mainBasement.addEventListener('click', () => {
      if (!isUserInputVisible) {
        document.querySelector('#user-input').style.display = 'block'
        isUserInputVisible = true
      } else {
        this._signIn(form)
      }
    })
  }

  render () {
    return 'Sign In'
  }

  _signIn(form) {
    if (form[0].value && form[1].value && form[2].value) {
      this.apiWorker.signIn(form, this.info)
    }
  }
}