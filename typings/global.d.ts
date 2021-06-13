import discord from 'discord.js'
import Enmap from 'enmap';
import nukejs from 'nukejs'

declare global {
  export class FurClient extends nukejs.Client {
    fdevsLog?: string;
    fdevsError?: string;
    fwebsLog?: string;
    bumpEnmap?: Enmap;
    coinDropArray?: number[];
  }

  export interface Console extends Console {
    logs: any[];
    stdlog: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; };
  }
}
