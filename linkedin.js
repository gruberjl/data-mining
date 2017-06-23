var webdriver = require('selenium-webdriver')
var driver = new webdriver.Builder().forBrowser('chrome').build();
const {By, until, Key} = webdriver
const env = require('./env.js')

exports.login = () => {
  driver.get('https://www.linkedin.com');
  var emailEl = driver.findElement(By.id('login-email'))
  var passEl = driver.findElement(By.id('login-password'))
  emailEl.sendKeys(env.LINKEDIN_EMAIL())
  passEl.sendKeys(env.LINKEDIN_PASSWORD())
  return emailEl.submit().then(() => {
    return driver.getTitle().then(function(title) {
      return {
        isLoggedIn: title == "LinkedIn",
        driver
      }
    })
  });
}

const getCompanyFollowersCount = () => {
  var followersEl = driver.findElements(By.className('org-top-card-module__followers-count'))
  return followersEl.getText().then((text) => {
    return text.split("\n")[1].split(' ')[0]
  })
}

const getCompanyEmployeeName = (el) =>
  el.findElement(By.className("name")).then((nameEl) => nameEl.getText()).catch(() => "")

const getCompanyEmployeeTitle = (el) => el.findElement(By.className("subline-level-1")).then((titleEl) => titleEl.getText())
const getCompanyEmployeeLocation = (el) => el.findElement(By.className("subline-level-2")).then((locationEl) => locationEl.getText())
const getCompanyEmployeeLink = (el) => el.findElement(By.className("search-result__result-link"))
  .then((linkEl) => linkEl.getAttribute('href'))

const getCompanyEmployee = (el) =>
  getCompanyEmployeeName(el).then(
    (name) => getCompanyEmployeeTitle(el).then(
      (title) => getCompanyEmployeeLocation(el).then(
        (location) => getCompanyEmployeeLink(el).then(
          (link) => ({name, title, location, link})
        )
      )
    )
  )

const getCompanyEmployeesPage = (companyId, page=1) => {
  const promises = []

  driver.get(`https://www.linkedin.com/search/results/people/?facetCurrentCompany=${companyId}&page=${page}`)
  return driver.executeScript('window.scrollTo(0, document.body.scrollHeight)')
    .then(() => driver.sleep(500))
    .then(() => driver.findElements(By.className("search-result__wrapper")))
    .then((els) => {
      els.forEach((el, idx) => {
        promises.push(getCompanyEmployee(el).then((employee) => {
            return employee
        }))
      })
    })
    .then(() => driver.findElement(By.className("next")).then(() => true, () => false))
    .then((hasAnotherPage) =>
      Promise.all(promises).then((people) => ({people, hasAnotherPage}))
    )
}

exports.getCompanyEmployees = (companyId) => new Promise((res, rej) => {
  let page = 1
  let people = []

  const complete = () => res({people})

  const getter = () => {
    getCompanyEmployeesPage(companyId, page).then((results) => {
      page++
      people = people.concat(results.people)
      if (results.hasAnotherPage) {
        getter()
      } else {
        complete()
      }
    })
  }

  getter()
})

const getCompanyInfo = () => {
  const results = {}
  getCompanyFollowersCount().then((followersCount) => {
    results.followersCount = followersCount
  })
}

const getCompanyId = (companyUrl) => companyUrl.split("/")[4]

exports.getCompany = (url) => {
  driver.get(url)
  return driver.wait(until.elementLocated(By.className("org-top-card-module__name")), 3000).then(() => {
    driver.getTitle().then(function(title) {
      getCompanyInfo()
    })
  })
}

exports.driver = () => driver
exports.webdriver = () => webdriver
exports.quit = () => driver.quit()
