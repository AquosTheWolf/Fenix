import {
	ApplicationCommandOptionData,
	ChatInputApplicationCommandData,
	Client,
	ClientOptions,
	Collection,
} from "discord.js";
import BaseCommand from "../structures/BaseCommand";
import * as config from "../config.json";
import Logger from "../utils/Logger";
import fs from "fs";
import BaseEvent from "../structures/BaseEvent";
import { loadSlashCommand } from "../utils/LoadSlash";

export default class FenixClient extends Client {
	public commands: Collection<string, BaseCommand>;
	public config: typeof config;
	public _logger: Logger;
	public arrayOfSlashCommands: (ChatInputApplicationCommandData & BaseCommand)[];
	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.config = config;
		this.arrayOfSlashCommands = [];
		this._logger = new Logger(this);
	}

	public async loadCommands(): Promise<void> {
		this._logger.info("Loading commands...");
		fs.readdirSync("./dist/commands").forEach(async (category) => {
			this._logger.info(`Loading commands from ${category}...`);
			fs.readdirSync(`./dist/commands/${category}`).forEach(async (cmd) => {
				this._logger.info(`Loading command ${cmd}...`);
				const command: BaseCommand = new (require(`../commands/${category}/${cmd}`).default)(this);
				loadSlashCommand(this, { command, category });
			});
		});
	}

	public async loadEvents(): Promise<void> {
		this._logger.info(`Loading Events`);
		fs.readdirSync("dist/events/").forEach((evt) => {
			try {
				const { event, run }: BaseEvent = new (require(`../events/${evt}`).default)(this);
				this.on(event, run.bind(null, this));
			} catch (e) {
				this._logger.error(`Error Loading ${evt.split(".")[0]} ${e}`);
			}
		});
	}
}
