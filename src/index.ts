// Imports
import { MessageEmbed } from 'discord.js';
import 'dotenv/config';
import { Client as ClientDB } from './database/models/ClientsConfig';
import { FurClient } from './lib/FurClient';
import settings from './settings';

// Structures
import './structures/Guild';
import './structures/GuildMember';
import './structures/User';

// FurDevs Banner
console.log(String.raw` _____           ____                  `);
console.log(String.raw`|  ___|   _ _ __|  _ \  _____   _____  `);
console.log(String.raw`| |_ | | | | '__| | | |/ _ \ \ / / __| `);
console.log(String.raw`|  _|| |_| | |  | |_| |  __/\ V /\__ \ `);
console.log(String.raw`|_|   \__,_|_|  |____/ \___| \_/ |___/ `);
console.log(String.raw`_______________________________________`);
console.log(String.raw`                                       `);

// Initialize the Client with NukeJS
const client = new FurClient({
    discordOptions: { disableMentions: 'everyone', fetchAllMembers: true },
    readyMessage: 'I have started! {username}',
    owner: settings.owner,
    devIds: settings.devs
});




const init = async () => {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function() {
        console.logs.push(Array.from(arguments) + '\n');
        if(console.logs.length > 10) {
            for(let i = 0; i != 3; i++) {
                console.logs.shift();
            }
        }
        console.stdlog.apply(console, arguments);
    };

    client.login(process.env.TOKEN);
};

init();

client.on('ready', async () => {
    const clientSettings = await ClientDB.findOne({ id: 1 });
    if(!clientSettings) await ClientDB.create({ id: 1 });
    const embed = new MessageEmbed()
        .setTitle('Fenix is ready!')
        .setColor(settings.primaryColor)
        .addField('Version', (await require('./../package.json')).version)
        .setThumbnail(
            'https://cdn.discordapp.com/emojis/758388154465517578.png?v=1'
        );
    client.users.cache.get('852070153804972043')?.send(embed);

    // Sets the Status
    client.user?.setActivity({
        name: `My Fuzzy Friends`,
        type: 'WATCHING'
    });
});


process.on('unhandledRejection', (e: string) =>
    console.error('unhandledErrorRejection!\n' + e)
);