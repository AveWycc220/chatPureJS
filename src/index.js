import '../scss/style.scss'
import '../assets/img/chat.png'
import EventsHandler from './events/eventsHandler'
import DOMRender from './render/render'
import API from './api/api'
import Router from './router/router'
import State from './state/state'
import Cookie from './cookies/cookie'
import ComponentsHandler from './components/componentsHandler'
import ButtonLogin from './components/loginPage/buttonLogin'
import ButtonSignin from './components/loginPage/buttonSignin'
import EmailInput from './components/loginPage/emailInput'
import PasswordInput from './components/loginPage/passwordInput'
import UserInput from './components/loginPage/userInput'
import RootLogin from './components/loginPage/rootLogin'
import InfoDiv from "./components/loginPage/infoDiv";

const cookie = new Cookie()
const router = new Router(cookie)

router.redirect()

const render = new DOMRender(cookie)
const stateChat = new State(render)
const eventHandler = new EventsHandler({
  renderWorker: render,
  apiWorker: apiSocket,
  routerWorker: router,
  buttonSend: document.querySelector('#send'),
  messageInput: document.querySelector('.textarea'),
  logoutButton: document.querySelector('#log-out'),
})
const apiSocket = new API(process.env.API_ADDRESS, cookie, router, stateChat, render, eventHandler)


new ComponentsHandler({
  renderWorker: render,
  apiWorker: apiSocket,
  routerWorker: router,
  RootLogin: RootLogin,
  InfoDiv: InfoDiv,
  ButtonLogin: ButtonLogin,
  ButtonSignin: ButtonSignin,
  EmailInput: EmailInput,
  PasswordInput: PasswordInput,
  UserInput: UserInput,
})