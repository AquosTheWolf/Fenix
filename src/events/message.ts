import { Message } from "discord.js";
import { Event } from "nukejs";

module.exports = class extends Event {
    constructor() {
        super({
            name: "message",
            enabled: true,
        });
    }

    async run(message: Message) {
        if (message.author.bot || message.client.user.id === message.author.id)
            return;
        if (message.channel.type === "dm") {
            message.channel.send(
                `Heya, I don't respond to dms. Please make sure you use me in the FurDevs server and if you need help please run \`//staff\` in the bot commands channel to open an inquiry`
            );
        }
    }
};
