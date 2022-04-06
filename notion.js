require('dotenv').config()
const { Client } = require('@notionhq/client')
// Initializing a client with access token
const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

const getNewUpdate = async () => {
  // asking for all the list of tasks using databaseId of the database table in notion
  const payload = {
    path: `databases/${databaseId}/query`,
    method: 'POST',
  }
  const data = await notion.request(payload)

  const task = data.results.map((page) => {
    // returning a task will return a obj with properties id, url, task, category, status, blame, date, comments
    return {
      id: page.id,
      url: page.url,
      task: page.properties.Task.title[0].text.content,
      category: page.properties.Category.multi_select[0].name,
      status: page.properties.Status.select.name,
      blame: page.properties.Blame.people[0].name,
      date: page.properties.Date.date.start,
      comments: page.properties.Comments.rich_text[0].text.content,
    }
  })
  return task
}

module.exports = getNewUpdate
