const fetchMailchimp = require('./fetchMailchimp')
const fetchSubscriber = require('./fetchSubscriber')

module.exports = async function watchOath(isWatching, emailAddress, oathContractAddressHexUnprefixed, oathIdNumber) {
  const listId = '72d8347423'
  const tags = [
    `watch-oath-${oathContractAddressHexUnprefixed}-${oathIdNumber}`
  ]

  const mailchimp = await fetchMailchimp()
  const subscriber = await fetchSubscriber(listId, emailAddress)

  if (subscriber === null) {
    await mailchimp.post({
      path: '/lists/72d8347423/members',
      body: {
        email_address: emailAddress,
        status: 'subscribed',
        tags
      }
    })
  } else {
    await mailchimp.patch({
      path: `/lists/${listId}/members/${subscriber.id}`,
      body: {
        email_address: emailAddress,
        status: 'subscribed',
      }
    })
    await mailchimp.post(`/lists/${listId}/members/${subscriber.id}/tags`, {
      tags: tags.map((tag) => {
        return { name: tag, status: isWatching ? 'active' : 'inactive' }
      })
    })
  }
}
