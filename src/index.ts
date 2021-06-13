import { Collection } from 'discord.js';
import { Client, CommandLoader, EventLoader } from 'nukejs'
import chalk from 'chalk';
import { readdirSync } from 'fs';
import 'dotenv/config'
require("./structures/Guild");
require("./structures/User");
require("./structures/GuildMember");
import enmap from 'enmap'
import mongoose from 'mongoose'
//import { load } from './utils/utils
console.log(String.raw` _____           ____                  `);
console.log(String.raw`|  ___|   _ _ __|  _ \  _____   _____  `);
console.log(String.raw`| |_ | | | | '__| | | |/ _ \ \ / / __| `);
console.log(String.raw`|  _|| |_| | |  | |_| |  __/\ V /\__ \ `);
console.log(String.raw`|_|   \__,_|_|  |____/ \___| \_/ |___/ `);
const client: FurClient = new Client({ 
  discordOptions: {disableMentions: 'everyone'} ,
  readyMessage: 'I have started! {username}',
  owner: '679145795714416661',
  devIds: ["216037365829992448", "388157815136452609", "562086061153583122", "679145795714416661", "436565164674908170"]
})

const commands = new CommandLoader(client, {prefix: '>', directory: './commands'})
const events = new EventLoader(client, {directory: './events'})

// Console Chalk
client['fdevsLog'] = `${chalk.cyanBright("[FurDevs - Log]")}`;
client['fdevsError'] = `${chalk.redBright("[FurDevs - Error]")}`;
client['fwebsLog'] = `${chalk.greenBright("[FurDevs Web - Log]")}`;
client['bumpEnmap'] = new enmap({name: "enmap"});

mongoose.connect(process.env.DB!, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})
.then(() => {
  console.log(`${client.fdevsLog} Connected to MongoDB`);
})
.catch((err) => {
  console.log(`${client.fdevsError} WHOOPS! We ranned into an Database Error\n\n${err}`); 
});

const init = async () => {
  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function(){
    console.logs.push(Array.from(arguments) + "\n");
    if (console.logs.length > 10) {
      for (let i = 0; i != 3; i++) {
        console.logs.shift()
      }
    }
    //@ts-ignore
    console.stdlog.apply(console, arguments);
  }

  // Create Probability array for Coin drop
  const settings = require("./settings.json");
  let probabilityArray = [];
  for (let key in settings.coinDropProbability) {
    for (let i = 0; i < settings.coinDropProbability[key]; i++) {
      probabilityArray.push(Number(key));
    }
  }
  client.coinDropArray = probabilityArray;

  client.login(process.env.TOKEN);
};

init();
