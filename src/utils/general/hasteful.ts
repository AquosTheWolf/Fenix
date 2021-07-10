export async function generateHastebin(code: string): Promise<string | void> {
    try {
        require('hastebin-gen')(code, {
            url: 'https://hastebin.com/'
        }).then((result: string) => {
            return result;
        });
    } catch(err) {
        return err;
    }
}