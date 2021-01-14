import '../scss/style.scss'
import '../assets/img/chat.png'
import EventsHandler from './events/eventsHandler'
import DOMRender from './render/render'
import API from './api/api'
import Router from './router/router'
import State from './state/state'
import Cookie from './cookies/cookie'

const cookie = new Cookie()
const router = new Router(cookie)

router.redirect()

const render = new DOMRender(cookie)
const stateChat = new State(render)
const apiSocket = new API('ws://127.0.0.1:5025', cookie, router, stateChat)

const eventHandler = new EventsHandler({
  renderWorker: render,
  apiWorker: apiSocket,
  form: document.querySelector('#keys'),
  loginButton: document.querySelector('#log-in'),
  signinButton: document.querySelector('#sign-in'),
  divInfo: document.querySelector('.info'),
  buttonSend: document.querySelector('#send'),
  messageInput: document.querySelector('.textarea'),
  logoutButton: document.querySelector('#log-out')
})

console.log(process.env.MODE)