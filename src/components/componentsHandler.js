export default class ComponentsHandler {
  constructor({apiWorker = undefined, routerWorker = undefined, cookieWorker = undefined,
                ButtonLogin = undefined, ButtonSignin = undefined,
                  EmailInput = undefined, PasswordInput = undefined, UserInput = undefined,
                    RootLogin = undefined, RootMain = undefined, InfoDiv = undefined,
                      NameDiv = undefined, LogoutButton = undefined, MessageInput = undefined,
                        SendButton = undefined, MessageList = undefined, DeleteButton = undefined,
                          EditButton = undefined,
  }) {
    this.router = routerWorker
    if (this.router.isLoginPage() && ButtonLogin && ButtonSignin && EmailInput && PasswordInput && UserInput && RootLogin) {
      new RootLogin({node: 'body', typeOfElement: 'div'})
      new InfoDiv({node: '.form', typeOfElement: 'div', insert: 'beforebegin', insertElement: '.button-div'})
      new ButtonLogin({apiWorker: apiWorker, node: '.button-div', typeOfElement: 'button'})
      new ButtonSignin({apiWorker: apiWorker, node: '.button-div', typeOfElement: 'button'})
      new EmailInput({node: '#keys', typeOfElement: 'input'})
      new PasswordInput({node: '#keys', typeOfElement: 'input'})
      new UserInput({node: '#keys', typeOfElement: 'input'})
    } else if (!this.router.isLoginPage() && RootMain && NameDiv && LogoutButton && MessageInput && SendButton && MessageList
      && DeleteButton && EditButton) {
      new RootMain({node: 'body', typeOfElement: 'div'})
      new NameDiv({cookieWorker: cookieWorker, node: 'header', typeOfElement: 'div'})
      new LogoutButton({apiWorker: apiWorker, node: 'header', typeOfElement: 'button'})
      new MessageInput({node:'#message-input', typeOfElement: 'div'})
      new SendButton({apiWorker: apiWorker, node:'#message-input', typeOfElement: 'button'})
      new MessageList({apiWorker: apiWorker, cookieWorker: cookieWorker, node: 'section', typeOfElement: 'div',
        prependElements: true, childComponents: {
          deleteButton: new DeleteButton({apiWorker: apiWorker, typeOfElement: 'button'}),
          editButton: new EditButton({apiWorker: apiWorker, typeOfElement: 'button'})
        }})
    } else {
      document.querySelector('.root').innerHTML = 'Component Error'
    }
  }
}