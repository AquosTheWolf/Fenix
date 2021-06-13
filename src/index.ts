import { Client, CommandLoader, EventLoader } from "nukejs";
import chalk from "chalk";
import "dotenv/config";
import enmap from "enmap";
import mongoose from "mongoose";
import settings from "./settings";

// ! Disabled Until Further notice
// require("./structures/Guild");
// require("./structures/User");
// require("./structures/GuildMember");

// FurDevs Banner
console.log(String.raw` _____           ____                  `);
console.log(String.raw`|  ___|   _ _ __|  _ \  _____   _____  `);
console.log(String.raw`| |_ | | | | '__| | | |/ _ \ \ / / __| `);
console.log(String.raw`|  _|| |_| | |  | |_| |  __/\ V /\__ \ `);
console.log(String.raw`|_|   \__,_|_|  |____/ \___| \_/ |___/ `);
console.log(String.raw`_______________________________________`);
console.log(String.raw`                                       `);

// Initialize the Client with NukeJS
const client: FurClient = new Client({
  discordOptions: { disableMentions: "everyone" },
  readyMessage: "I have started! {username}",
  owner: "679145795714416661",
  devIds: [
    "216037365829992448",
    "388157815136452609",
    "562086061153583122",
    "679145795714416661",
    "436565164674908170",
  ],
});

const commands = new CommandLoader(client, {
  prefix: ">",
  directory: "dist/commands",
});
const events = new EventLoader(client, { directory: "dist/events" });

// Console Chalk
client["fdevsLog"] = `${chalk.cyanBright("[FurDevs - Log]")}`;
client["fdevsError"] = `${chalk.redBright("[FurDevs - Error]")}`;
client["fwebsLog"] = `${chalk.greenBright("[FurDevs Web - Log]")}`;
client["bumpEnmap"] = new enmap({ name: "enmap" });
client["commands"] = commands;
client["events"] = events;

mongoose
  .connect(process.env.DB!, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`${client.fdevsLog} Connected to MongoDB`);
  })
  .catch((err) => {
    console.log(
      `${client.fdevsError} WHOOPS! We ranned into an Database Error\n\n${err}`
    );
  });

const init = async () => {
  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function () {
    console.logs.push(Array.from(arguments) + "\n");
    if (console.logs.length > 10) {
      for (let i = 0; i != 3; i++) {
        console.logs.shift();
      }
    }
    console.stdlog.apply(console, arguments);
  };

  // Create Probability array for Coin drop

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
