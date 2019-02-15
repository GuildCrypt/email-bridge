const fetchMailchimp = require('./fetchMailchimp')
const fetchSubscriber = require('./fetchSubscriber')

module.exports = async function subscribe(firstName, lastName, emailAddress, tags) {
  const listId = '72d8347423'

  const mailchimp = await fetchMailchimp()
  const subscriber = await fetchSubscriber(listId, emailAddress)

  if (subscriber === null) {
    await mailchimp.post({
      path: '/lists/72d8347423/members',
      body: {
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        },
        email_address: emailAddress,
        status: 'subscribed',
        tags
      }
    })
  } else {
    await mailchimp.patch({
      path: `/lists/${listId}/members/${subscriber.id}`,
      body: {
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        },
        email_address: emailAddress,
        status: 'subscribed',
      }
    })
    await mailchimp.post(`/lists/${listId}/members/${subscriber.id}/tags`, {
      tags: tags.map((tag) => {
        return { name: tag, status: 'active' }
      })
    })
  }
}
