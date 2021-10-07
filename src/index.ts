import FenixClient from "./lib/FenixClient";

const client = new FenixClient({
	intents: ["GUILDS"],
});

(async() => {
    await client.loadCommands()
    await client.loadEvents()
    client.login(client.config.token);
})()