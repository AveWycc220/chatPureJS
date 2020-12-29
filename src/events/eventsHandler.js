import DOMRender from "../render/render";

const render = new DOMRender()

class EventsHandler{
  constructor({api = undefined, form = undefined, loginButton = undefined, signinButton =  undefined,
                divInfo = undefined}) {
    this.api = api
    this.info = divInfo
    this.signinEvent(form, signinButton)
    this.loginEvent(form, loginButton)
    this.loadingEvent()
  }

  signinEvent(form, btn) {
    if (btn && form) {
      btn.addEventListener('click', () => {
        render.showInput(form[2])
        if (form[0].value && form[1].value && form[2].value) {
          this.api.signIn(form, this.info)
          render.restyleForm(form, true)
        } else {
          render.restyleForm(form, true)
        }
      })
    }
  }

  loginEvent(form, btn) {
    if (btn && form) {
      btn.addEventListener('click', () => {
        if (form[0].value && form[1].value) {
          this.api.logIn(form, this.info)
          render.restyleForm(form)
        } else {
          render.restyleForm(form)
        }
      })
    }
  }

  loadingEvent() {
    document.addEventListener('DOMContentLoaded', () => {
      let root = document.querySelector('.root')
      console.log(root)
      root.style.display = 'block'
    })
  }
}

export default EventsHandler