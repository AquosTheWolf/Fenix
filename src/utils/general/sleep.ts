/**
 * Make the bot wait for x amount of milliseconds before doing another action
 *
 * @param milliseconds How much time in milliseconds the bot should wait before the next action
 * @example await sleep(5000) // Waits 5 seconds before doing the next action
 * console.log(`*5 seconds later* I'm here`)
 */
export async function sleep(milliseconds: number) {
    return new Promise<void>((res) => {
        setTimeout(() => {
            res();
        }, milliseconds);
    });
}
