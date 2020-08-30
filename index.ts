import Bot from 'keybase-bot';
import p from 'phin';
import { MsgSummary } from 'keybase-bot/lib/types/chat1';

const bot = new Bot();

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
    await bot.chat.watchAllChannelsForNewMessages(handleMessage, onError, { hideExploding: true, showLocal: false });
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
  const body = message.content?.text?.body;
  if (!body) {
    return;
  }

  if (body.startsWith('!catfact')) {
    bot.chat.send(message.conversationId, {
      body: await getNewCatFact(),
    });
  }

  if (body.includes(':wave:')
  || body.toUpperCase().includes('HALLO')
  || body.toUpperCase().includes('HELLO')
  || body.toUpperCase().includes('GOOD MORNING')
  || body.toUpperCase().startsWith('HI')
  || body.toUpperCase().includes('BONJOUR')) {
    await bot.chat.react(message.conversationId, message.id, ':wave:');
  }
  if (body.toUpperCase().includes('SHIT')
  || body.toUpperCase().includes('CRAP')
  || body.toUpperCase().includes('POOP')) {
    await bot.chat.react(message.conversationId, message.id, ':hankey::dash:');
  }
  if (body.includes(':hankey:')
  || body.includes(':poopnerd:')
  || body.includes(':poop:')
  || body.includes(':shit:')) {
    await bot.chat.react(message.conversationId, message.id, ':hankey:');
  }
  if (body.toUpperCase().includes('FART')) {
    await bot.chat.react(message.conversationId, message.id, ':hankey::dash:');
  }
  if (body.toUpperCase().includes('TRASH')) {
    await bot.chat.react(message.conversationId, message.id, ':wastebasket:');
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
