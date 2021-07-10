import chalk from 'chalk';
import { Collection } from 'discord.js';
import mongoose from 'mongoose';
import { Client, Command, CommandLoader, EventLoader, NukeClientOptions } from 'nukejs';
import settings from '../settings';

export class FurClient extends Client{
    public commandLoader: CommandLoader
    public events: EventLoader
    public commands: Collection<string, Command>
    public coinDropArray: number[]
    constructor(options: NukeClientOptions) {
        super(options);
        // Command Loader
        this.commandLoader = new CommandLoader(this, {
            prefix: async(msg) => {
                if(msg.guild) return (await msg.guild.settings()).prefix
                    return settings.prefix
            },
            directory: "dist/commands"
        })
        // Event Loader
        this.commands = this.commandLoader.Commands
        this.events = new EventLoader(this, { directory: 'dist/events' });
        this.coinDropArray = this.setProbabilityArray()
    }

    public log(msg: string){
        console.log(`${chalk.cyan('[FENIX-LOG]')} - ${msg}`)
    }

    public debug(msg: string){
        console.log(`${chalk.blue('[FENIX-DEBUG]')} - ${msg}`)
    }

    public error(msg: string){
        console.log(`${chalk.red('[FENIX-ERROR]')} - ${msg}`)
    }

    public setProbabilityArray(){
        // Create Probability array for Coin drop
        let probabilityArray = [];
        for(let key in settings.coinDropProbability) {
            for(let i = 0; i < settings.coinDropProbability[key]; i++) {
                probabilityArray.push(Number(key));
            }
        }
        return probabilityArray;
    }

    public connectDB(){
        mongoose
            .connect(process.env.DB!, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            })
            .then(() => this.log(`Connected to MongoDB`))
            .catch((err) => this.log(`WHOOPS! We ran into an Database Error\n\n${err}`));
    }
}
