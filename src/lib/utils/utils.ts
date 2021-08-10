import fs from 'fs';
import path from 'path';

export const walkDir = async (dir: string): Promise<string[]> => {
	let results: string[] = [];

	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, list) => {
			if (err) return reject(err);

			let pending = list.length;

			if (!pending) return resolve(results);

			list.forEach((file) => {
				file = path.resolve(dir, file);

				fs.stat(file, async (err, stat) => {
					if (err) return reject(err);

					if (stat && stat.isDirectory()) {
						try {
							const dir = await walkDir(file);

							results = results.concat(dir as unknown as string);

							if (!--pending) resolve(results);
						} catch (err) {
							reject(err);
						}
					} else {
						results.push(file);
						if (!--pending) resolve(results);
					}
				});
			});
		});
	});
};
