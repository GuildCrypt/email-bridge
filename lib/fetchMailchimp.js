const Mailchimp = require('mailchimp-api-v3')
const fetchMailchimpApiKey = require('./fetchMailchimpApiKey')
const Promise = require('bluebird')

let mailchimp

module.exports = async function fetchMailchimp() {
  if (mailchimp) {
    return new Promise((resolve) => {
      resolve(mailchimp)
    })
  }
  mailchimpApiKey = await fetchMailchimpApiKey()
  mailchimp = new Mailchimp(mailchimpApiKey)
  return fetchMailchimp()
}
