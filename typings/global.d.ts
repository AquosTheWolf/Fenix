import discord, { Collection } from 'discord.js'
import Enmap from 'enmap';
import nukejs, { Command, CommandLoader, EventLoader } from 'nukejs'

declare global {
  export class FurClient extends nukejs.Client {
    fdevsLog?: string;
    fdevsError?: string;
    fwebsLog?: string;
    bumpEnmap?: Enmap;
    coinDropArray?: number[];
    commands?: Collection<string, Command>
    events?: EventLoader;
  }

  export interface Console {
    logs: any[];
    stdlog: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; };
  }
}
