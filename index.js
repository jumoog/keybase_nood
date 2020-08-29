"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keybase_bot_1 = __importDefault(require("keybase-bot"));
const phin_1 = __importDefault(require("phin"));
const bot = new keybase_bot_1.default();
async function main() {
    try {
        const username = process.env.KB_USERNAME || 'bot';
        const paperkey = process.env.KB_PAPERKEY || '';
        await bot.init(username, paperkey, { botLite: false, verbose: false, autoLogSendOnCrash: false });
        const info = bot.myInfo();
        console.log(`Echo bot initialized with username ${info === null || info === void 0 ? void 0 : info.username}.`);
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
    }
    catch (error) {
        console.error(error);
    }
}
/**
 * exit the bot gracefully
 */
async function shutDown() {
    await bot.deinit();
    process.exit();
}
async function onError(err) {
    console.error(err);
    process.exit(1);
}
async function handleMessage(message) {
    var _a, _b;
    const body = (_b = (_a = message.content) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.body;
    if (!body) {
        return;
    }
    if (body.startsWith('!catfact')) {
        bot.chat.send(message.conversationId, {
            body: await getNewCatFact(),
        });
    }
    if (body.includes(':wave:')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.toUpperCase().includes('HALLO')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.toUpperCase().includes('HELLO')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.toUpperCase().includes('GOOD MORNING')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.toUpperCase().startsWith('HI')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.toUpperCase().includes('BONJOUR')) {
        await bot.chat.react(message.conversationId, message.id, ':wave:');
    }
    if (body.includes(':hankey:')) {
        await bot.chat.react(message.conversationId, message.id, ':hankey:');
    }
    if (body.includes(':poopnerd:')) {
        await bot.chat.react(message.conversationId, message.id, ':hankey:');
    }
    if (body.includes('fart')) {
        await bot.chat.react(message.conversationId, message.id, ':hankey::dash:');
    }
}
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
main();
async function getNewCatFact() {
    const url = 'https://catfact.ninja/fact';
    const res = await phin_1.default({
        url,
        parse: 'json',
    });
    if (res.statusCode === 200) {
        const catfact = res === null || res === void 0 ? void 0 : res.body;
        return catfact.fact;
    }
    return res.statusCode;
}
