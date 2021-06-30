import { Message } from 'discord.js';

export function check(item: Message) {
    if(!item) return false;
    else return !(item.content.toLowerCase() == 'cancel' ||
        item.content.toLowerCase() === 'stop');
}

export async function failed(message: Message, embed: Message) {
    await embed.delete();
    return (await message.edit('Prompt cancelled.')).delete({
        timeout: 1000 * 30
    });
}
