const session_key = process.env.LINKEDIN_EMAIL
const session_password = process.env.LINKEDIN_PASSWORD

const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const jsdomOptions = {
  includeNodeLocations: true,
  'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  runScripts: "dangerously",
  cookiejar: new jsdom.CookieJar()
}
jsdomOptions.cookiejar.rejectPublicSuffixes = true
const request = require('request-promise').defaults({
  jar: require('request-promise').jar(
    jsdomOptions.cookiejar.store,
    {rejectPublicSuffixes: true, enableLooseMode:true}
  )
});

const loginGetForm = () => JSDOM.fromURL("https://www.linkedin.com/", jsdomOptions).then((dom) => {
    const loginCsrfParam = dom.window.document.querySelector("#loginCsrfParam-login").value
    const form = {session_key, session_password, isJsEnabled: true, loginCsrfParam}
    return form
  },
  (err) => console.log('not heres')
)

const loginPost = (form) => {
  return request.post({url: "https://www.linkedin.com/uas/login-submit", form, followAllRedirects: true})
}

loginGetForm().then(loginPost).then((results) => {
  console.log(results)
})

/*
const loginCookieJar = (cookies, url="https://www.linkedin.com/uas/login-submit") => {
  let j = request.jar();
  cookies.split('; ').forEach((cookie) => {
    j.setCookie(request.cookie(cookie), url);
  })
  return j
}
*/

const loginPostOld = (cookies, loginCsrfParam, session_key = username, session_password = password, isJsEnabled = false) => new Promise((res, rej) =>{
  const url = "https://www.linkedin.com/uas/login-submit"
  const form = {session_key, session_password, isJsEnabled, loginCsrfParam}
  //const jar = loginCookieJar(cookies)
  //request.post({url, jar, form, followAllRedirects: true}).then((page) => {
  request.post({url, form, followAllRedirects: true}).then((page) => {
    res({form, page})
  }, (err) => {
    rej(err)
  })
})

const loginOld = () => JSDOM.fromURL("https://www.linkedin.com/", jsdomOptions).then((dom) => {
  //const cookies = dom.window.document.cookie
  const csrf = dom.window.document.querySelector("#loginCsrfParam-login").value
  //return loginPost(cookies, csrf).then((results) => {
  return loginPost({}, csrf).then((results) => {
    //jsdomOptions.cookieJar =  new jsdom.CookieJar(results.jar.store, {rejectPublicSuffixes: false});
    //console.log(results.jar)
    return results
  }, (err) => {
    console.log(err)
  })
}, (err) => {
  console.log('err')
});

const getCompanyPage = (url) => JSDOM.fromURL(url, jsdomOptions).then((dom) => {
  //console.log(dom.serialize())
}, (err) => {
  //console.log(err)
})

//login().then(() => getCompanyPage("https://www.linkedin.com/company/wusinich-brogan-&-stanzione"))

const linkedinLogin = () => {
  const JSDOM = jsdom.JSDOM;
  //var cookiejar = new tough.CookieJar();
  //cookiejar.synchronous = true
  const store = new tough.Store
  store.synchronous = true
  request = request.defaults({ jar : request.jar(store) })
  const jsdomOptions = {
    includeNodeLocations: true,
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    runScripts: "dangerously",
    cookiejar: new jsdom.CookieJar(store, {rejectPublicSuffixes: false, looseMode: true})
  }

  JSDOM.fromURL("https://www.linkedin.com/", jsdomOptions)
  .then(
    (dom) => {
      const loginCsrfParam = dom.window.document.querySelector("#loginCsrfParam-login").value
      const form = {session_key, session_password, isJsEnabled: true, loginCsrfParam}
      return form
    },
    (err) => console.log('not heres')
  ).then(
    (form) => request.post({url: "https://www.linkedin.com/uas/login-submit", form, followAllRedirects: true}),
    (err) => console.log('error here')
  ).then(
    (results) => {
      console.log('success')
    }, (err) => {
      console.log(err)
    }
  )
}
