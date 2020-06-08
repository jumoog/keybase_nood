const Bot = require('keybase-bot')
const bot = new Bot()
const p = require('phin').promisified;

async function main() {
  try {
    const username = process.env.KB_USERNAME
    const paperkey = process.env.KB_PAPERKEY
    await bot.init(username, paperkey)
    const info = bot.myInfo()
    console.log(`Echo bot initialized with username ${info.username}.`)

    await bot.chat.clearCommands()
    await bot.chat.advertiseCommands({
      advertisements: [
        {
          type: 'public',
          commands: [
            {
              name: 'catfact',
              description: 'Sends out your message to the current channel.',
              usage: '[your text]',
            },
          ],
        },
      ],
    })

    const onMessage = async message => {
      if (message.content.type !== 'text') {
        return
      }
      console.log(message.content.text.body)
      if (message.content.text.body.startsWith('!catfact')) {
        bot.chat.send(message.conversationId, {
            body: await getNewCatFact()
          })
      }

      if (message.content.text.body.startsWith('!video')) {
        bot.chat.send(message.conversationId, {
            body: "keybase://team/chloelewis.fans/blue-chair.mp4"
          })
      }
      if (message.content.text.body.startsWith('!darkmode')) {
        bot.chat.send(message.conversationId, {
            body: "keybase://chat/chloelewis.fans#general/1996"
          })
      }
      if (message.content.text.body.startsWith(':wave:')){
        bot.chat.react(message.conversationId, message.id, ':wave:')
      }
      if (message.content.text.body.toUpperCase().startsWith("HALLO")){
        bot.chat.react(message.conversationId, message.id, ':wave:')
      }
      if (message.content.text.body.toUpperCase().startsWith("HELLO")){
        bot.chat.react(message.conversationId, message.id, ':wave:')
      }
      if (message.content.text.body.toUpperCase().startsWith("GOOD MORNING")){
        bot.chat.react(message.conversationId, message.id, ':wave:')
      }
      if (message.content.text.body.toUpperCase().startsWith("HI")){
        bot.chat.react(message.conversationId, message.id, ':wave:')
      }
    }

    const onError = e => console.error(e)
    console.log(`Listening for messages...`)
    await bot.chat.watchAllChannelsForNewMessages(onMessage, onError)
  } catch (error) {
    console.error(error)
  }
}

async function shutDown() {
  await bot.deinit()
  process.exit()
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)

main()

async function getNewCatFact() {
    // build the URL
    let url = `https://catfact.ninja/fact`;
    // do the request
    let res = await p({
        url: url,
        parse: 'json'
    });
    return res.body.fact;
}