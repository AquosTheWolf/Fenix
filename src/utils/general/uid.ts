import random from 'crypto-random-string';

/**
 * This will generate a String with a Unique String that's based on data and the string
 *
 * @return A string with random characters.
 */
export async function uid(): Promise<string> {
    const initial = await Date.now().toString(16);
    return `${initial}${random({ length: 16 - initial.length })}`;
}
