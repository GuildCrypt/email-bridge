const fetchMailchimp = require('./fetchMailchimp')
const md5 = require('md5')

module.exports = async function fetchSubscriber(listId, emailAddress) {
  const mailchimp = await fetchMailchimp()
  const emailAddressHash = md5(emailAddress)
  return mailchimp.get({
    path: `/lists/${listId}/members/${emailAddressHash}`
  }).catch((error) => {
    if (error.status === 404) {
      return null
    }
  })
}
