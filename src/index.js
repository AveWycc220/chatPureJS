import '../scss/style.scss'
import '../assets/img/chat.ico'
import EventsHandler from './events/eventsHandler'
import API from './api/api'
import Router from './router/router';

const apiSocket = new API('ws://127.0.0.1:5025')
const router = new Router();

router.redirect()

const eventHandler = new EventsHandler({
  api: apiSocket,
  form: document.querySelector('#keys'),
  loginButton: document.querySelector('#log-in'),
  signinButton: document.querySelector('#sign-in'),
  divInfo: document.querySelector('.info')
})