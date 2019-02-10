const fs = require('fs')
const Promise = require('bluebird')

let mailchimpApiKey

module.exports = function fetchMailchimpApiKey() {
  if (process.env.MAILCHIMP_API_KEY) {
    mailchimpApiKey = process.env.MAILCHIMP_API_KEY
  }
  if (mailchimpApiKey) {
    return new Promise((resolve, reject) => {
      resolve(mailchimpApiKey)
    })
  }

  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../secrets/mailchimpApiKey.txt`, 'utf8', (error, mailchimpApiKeyUntrimmed) => {
      if (error) {
        reject(error)
        return
      }
      mailchimpApiKey = mailchimpApiKeyUntrimmed.trim()
      fetchMailchimpApiKey().then(resolve)
    })
  })
}
