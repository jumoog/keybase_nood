import Bot from 'keybase-bot';
import p from 'phin';
import { MsgSummary } from 'keybase-bot/lib/types/chat1';

const bot = new Bot();
const FILE_DIR = 'files/';

export interface Catfact {
  fact: string;
  length: number;
}

async function main(): Promise<void> {
  try {
    const username = process.env.KB_USERNAME || 'bot';
    const paperkey = process.env.KB_PAPERKEY || '';
    await bot.init(username, paperkey, { botLite: false, verbose: false, autoLogSendOnCrash: false });
    const info = bot.myInfo();
    console.log(`Echo bot initialized with username ${info?.username}.`);

    await bot.chat.clearCommands();
    await bot.chat.advertiseCommands({
      advertisements: [
        {
          type: 'public',
          commands: [
            {
              name: 'catfact',
              description: 'get random cat facts',
              usage: 'catfact',
            },
          ],
        },
      ],
    });
    console.log('Listening for messages...');
    await bot.chat.watchAllChannelsForNewMessages(handleMessage, onError, { hideExploding: false, showLocal: false });
  } catch (error) {
    console.error(error);
  }
}

/**
 * exit the bot gracefully
 */
async function shutDown(): Promise<void> {
  await bot.deinit();
  process.exit();
}

async function onError(err: Error): Promise<void> {
  console.error(err);
  process.exit(1);
}

async function handleMessage(message: MsgSummary): Promise<void> {
  const channel = message.channel.topicName;
  const body = message.content?.text?.body;
  if (!body) {
    return;
  }

  if (message.content.type === 'attachment') {
    if (channel === 'videos') {
      const attachment = message.content?.attachment;
      if (!attachment) {
        return;
      }
      bot.chat.download(message.conversationId, message.id, FILE_DIR + attachment.object.filename);
      return;
    }
  }

  if (body.startsWith('!catfact')) {
    bot.chat.send(message.conversationId, {
      body: await getNewCatFact(),
    });
  }

  if (body.includes(':wave:')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().includes('HALLO')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().includes('HELLO')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().includes('GOOD MORNING')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().startsWith('HI')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().includes('BONJOUR')) {
    bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.includes(':hankey:')) {
    bot.chat.react(message.conversationId, message.id, ':hankey:');
  }
  if (body.includes(':poopnerd:')) {
    bot.chat.react(message.conversationId, message.id, ':hankey:');
  }
  if (body.includes('fart')) {
    bot.chat.react(message.conversationId, message.id, ':hankey::dash:');
  }
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

main();

async function getNewCatFact(): Promise<string> {
  const url = 'https://catfact.ninja/fact';
  const res: any = await p({
    url,
    parse: 'json',
  });
  if (res.statusCode === 200) {
    const catfact: Catfact = res?.body;
    return catfact.fact;
  }
  return res.statusCode;
}
