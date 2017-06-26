const request = require('request-promise')
const cheerio = require('cheerio')
const async = require('async')
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

module.exports = (emailAddr) => request({
  method: 'POST',
  uri: 'http://mailtester.com/testmail.php',
  form: {
    lang: 'en',
    email: emailAddr
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
  }
}).then((html) => {
  const $ = cheerio.load(html)
  const result = $('table').find('td').last().text()

  return {
    success: result === "E-mail address is valid",
    message: result,
    emailAddress: emailAddr
  }
})


/* example
emailParser.validate('john.gruber@tierpoint.com').then((response) => {
  console.log(response)
})
*/
