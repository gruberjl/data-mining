const jsdom = require("jsdom");
const { JSDOM, CookieJar } = jsdom;
var request = require('request-promise');
const username = process.env.LINKEDIN_EMAIL
const password = process.env.LINKEDIN_PASSWORD
const jsdomOptions = {
  includeNodeLocations: true,
  'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  runScripts: "dangerously"
}

const loginCookieJar = (cookies, url="https://www.linkedin.com/uas/login-submit") => {
  let j = request.jar();
  cookies.split('; ').forEach((cookie) => {
    j.setCookie(request.cookie(cookie), url);
  })
  return j
}

const loginPost = (cookies, loginCsrfParam, session_key = username, session_password = password, isJsEnabled = false) => new Promise((res, rej) =>{
  const url = "https://www.linkedin.com/uas/login-submit"
  const form = {session_key, session_password, isJsEnabled, loginCsrfParam}
  const jar = loginCookieJar(cookies)
  request.post({url, jar, form, followAllRedirects: true}).then((page) => {
    res({jar, form, page})
  }, (err) => {
    rej(err)
  })
})

const login = () => JSDOM.fromURL("https://www.linkedin.com/", jsdomOptions).then((dom) => {
  const cookies = dom.window.document.cookie
  const csrf = dom.window.document.querySelector("#loginCsrfParam-login").value
  return loginPost(cookies, csrf)
});

login().then(({jar}) => {
  const url = "https://www.linkedin.com/company/wusinich-brogan-&-stanzione"
  jsdomOptions.cookieJar =  new jsdom.CookieJar(jar.store);

  JSDOM.fromURL(url, jsdomOptions).then((dom) => {
    console.log(dom.serialize())
  }, (err) => {
    console.log(err)
  })
})
