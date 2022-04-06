require('dotenv').config()
const getNewUpdate = require('./notion.js')
const { Webhook, MessageBuilder } = require('discord-webhook-node')

const hook = new Webhook(process.env.WEBHOOK_URL)
const array = []
/**
 * Initialize local data store.
 * Then call the function for changes in database table in every 5 seconds.
 */
const sendUpdate = () => {
  setInterval(async () => {
    try {
      // For each updated task, update in database notion and send a discord notification.
      await getNewUpdate().then((data) => {
        data.forEach((item) => {
          if (array.length === 0 || !array.includes(item.id)) {
            // MessageBuilder helps to build rich embeds for discord.
            const embed = new MessageBuilder()
              .setTitle(item.task)
              .setAuthor(item.blame)
              .setURL(item.url)
              .addField('Status', item.status, true)
              .addField('Category', item.category, true)
              .setColor('#00b0f4')
              .setFooter(item.comments)
              .setTimestamp()

            hook.send(embed)
            /**
             * Get and set the initial data store with tasks currently in the database.
             */
            array.push(item.id)
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
  }, 5000)
}
sendUpdate()
