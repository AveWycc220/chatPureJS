import '../scss/style.scss'
import '../assets/img/chat.png'
import EventsHandler from './events/eventsHandler'
import API from './api/api'
import Router from './router/router'
import Cookie from './cookies/cookie'
import ComponentsHandler from './components/componentsHandler'
import ButtonLogin from './components/loginPage/buttonLogin'
import ButtonSignin from './components/loginPage/buttonSignin'
import EmailInput from './components/loginPage/emailInput'
import PasswordInput from './components/loginPage/passwordInput'
import UserInput from './components/loginPage/userInput'
import RootLogin from './components/loginPage/rootLogin'
import InfoDiv from './components/loginPage/infoDiv'
import NameDiv from './components/mainPage/nameDiv'
import LogoutButton from './components/mainPage/logoutButton'
import MessageInput from './components/mainPage/messageInput'
import SendButton from './components/mainPage/sendButton'
import MessageList from './components/mainPage/messageList'
import DeleteButtonGlobal from './components/mainPage/deleteButtonGlobal'
import EditButtonGlobal from './components/mainPage/editButtonGlobal'
import RootMain from './components/mainPage/rootMain'

const cookie = new Cookie()
const router = new Router(cookie)

router.redirect()

const apiSocket = new API(process.env.API_ADDRESS, cookie, router, EventsHandler)

new ComponentsHandler({
  apiWorker: apiSocket,
  routerWorker: router,
  cookieWorker: cookie,
  RootLogin: RootLogin,
  InfoDiv: InfoDiv,
  ButtonLogin: ButtonLogin,
  ButtonSignin: ButtonSignin,
  EmailInput: EmailInput,
  PasswordInput: PasswordInput,
  UserInput: UserInput,
  NameDiv: NameDiv,
  LogoutButton: LogoutButton,
  MessageInput: MessageInput,
  SendButton: SendButton,
  MessageList: MessageList,
  DeleteButton: DeleteButtonGlobal,
  EditButton: EditButtonGlobal,
  RootMain: RootMain,
})