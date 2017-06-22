var webdriver = require('selenium-webdriver')
var driver = new webdriver.Builder().forBrowser('chrome').build();
const {By, until} = webdriver
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
  var followersEl = driver.findElement(By.className('org-top-card-module__followers-count'))
  return followersEl.getText().then((text) => {
    return text.split("\n")[1].split(' ')[0]
  })
}

const getCompanyEmployees = (companyId) => {
  
}

const getCompanyInfo = () => {
  const results = {}
  getCompanyFollowersCount().then((followersCount) => {
    results.followersCount = followersCount
  })
}

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
