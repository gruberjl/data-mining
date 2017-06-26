const validate = require('./validate.js')

const guesses = (domain, firstName, lastName) => [
  `${firstName}@${domain}`,
  `${firstName}${lastName}@${domain}`,
  `${firstName}.${lastName}@${domain}`,
  `${firstName.charAt(0)}${lastName}@${domain}`,
  `${firstName.charAt(0)}.${lastName}@${domain}`,
  `${firstName}${lastName.charAt(0)}@${domain}`,
  `${firstName}.${lastName.charAt(0)}@${domain}`,

  `${lastName}@${domain}`,
  `${lastName}${firstName}@${domain}`,
  `${lastName}.${firstName}@${domain}`,
  `${lastName.charAt(0)}${firstName}@${domain}`,
  `${lastName.charAt(0)}.${firstName}@${domain}`,
  `${lastName}${firstName.charAt(0)}@${domain}`,
  `${lastName}.${firstName.charAt(0)}@${domain}`,
]

module.exports = (domain, firstName, lastName) => new Promise((res, rej) => {
  let found = false
  let promise = new Promise((response) => response())
  let emailAddress = ""

  guesses(domain, name.firstName, name.lastName).forEach((guess) => {
    promise = promise.then(() => {
      if (found == false) {
        return validate(guess).then((result) => {
          if (result.success) {
            found = true
            emailAddress = result.emailAddress
          }

          return result
        })
      }

      return new Promise((res) => res())
    })
  })

  promise.then(() => {
    res({found, emailAddress})
  })
})
