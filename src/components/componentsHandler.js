export default class ComponentsHandler {
  constructor({apiWorker = undefined, routerWorker = undefined, cookieWorker = undefined,
                ButtonLogin = undefined, ButtonSignin = undefined, EmailInput = undefined,
                  PasswordInput = undefined, UserInput = undefined, RootLogin = undefined,
                    InfoDiv = undefined, NameDiv = undefined, LogoutButton = undefined,
                      MessageInput = undefined, SendButton = undefined,
  }) {
    this.router = routerWorker
    if (this.router.isLoginPage() && ButtonLogin && ButtonSignin && EmailInput && PasswordInput && UserInput && RootLogin) {
      new RootLogin({node: 'body', typeOfElement: 'div'})
      new InfoDiv({node: '.form', typeOfElement: 'div',
        insert: 'beforeBegin', insertElement: '.button-div'})
      new ButtonLogin({apiWorker: apiWorker, node: '.button-div', typeOfElement: 'button'})
      new ButtonSignin({apiWorker: apiWorker, node: '.button-div', typeOfElement: 'button'})
      new EmailInput({node: '#keys', typeOfElement: 'input'})
      new PasswordInput({node: '#keys', typeOfElement: 'input'})
      new UserInput({node: '#keys', typeOfElement: 'input'})
    } else if (!this.router.isLoginPage() && NameDiv && LogoutButton) {
      new NameDiv({cookieWorker: cookieWorker, node: 'header', typeOfElement: 'div'})
      new LogoutButton({apiWorker: apiWorker, node: 'header', typeOfElement: 'button'})
      new MessageInput({node:'#message-input', typeOfElement: 'div'})
      new SendButton({apiWorker: apiWorker, node:'#message-input', typeOfElement: 'button'})
    } else {
      document.querySelector('.root').innerHTML = 'Component Error'
    }
  }
}