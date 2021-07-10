import discord, { Collection } from 'discord.js'
import nukejs, { Command, CommandLoader, EventLoader } from 'nukejs'

declare global {
  export class FurClient extends nukejs.Client {
    fdevsLog?: string;
    fdevsError?: string;
    fwebsLog?: string;
    coinDropArray?: number[];
    commands?: Collection<string, Command>
    events?: EventLoader;
  }

  namespace Express{
    export interface Request{
      client: FurClient
    }
  }

  export interface Console {
    logs: any[];
    stdlog: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; };
  }
}