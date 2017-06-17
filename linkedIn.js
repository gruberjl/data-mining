const session_key = process.env.LINKEDIN_EMAIL
const session_password = process.env.LINKEDIN_PASSWORD

const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM
const jsdomOptions = {
  includeNodeLocations: true,
  'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  runScripts: "dangerously",
  cookiejar: new jsdom.CookieJar()
}
jsdomOptions.cookiejar.rejectPublicSuffixes = false
const request = require('request-promise').defaults({ jar : jsdomOptions.cookiejar })

const login = () => loginGetForm().then(loginPost)

const loginGetForm = () => JSDOM.fromURL("https://www.linkedin.com/", jsdomOptions).then((dom) => {
  const cookies = dom.window.document.cookie
  const loginCsrfParam = dom.window.document.querySelector("#loginCsrfParam-login").value
  return {cookies, loginCsrfParam}
})

const loginPost = ({cookies, loginCsrfParam}) => (jar) => {
  const url = "https://www.linkedin.com/uas/login-submit"
  const form = {session_key, session_password, isJsEnabled: false, loginCsrfParam}
  return request.post({url, jar, form, followAllRedirects: true})
}

const getCompany = (url) => () => JSDOM.fromURL(url, jsdomOptions).then((dom) => {
  console.log(dom.serialize())
}, (err) => {
  console.log(err)
})

const getCompanyEmployeesLink = () => {
  const linkClass = 'snackbar-description-see-all-link'
}

const getCompanyEmployees = () => {
  
}

login().then(getCompany("https://www.linkedin.com/company/wusinich-brogan-&-stanzione"))
