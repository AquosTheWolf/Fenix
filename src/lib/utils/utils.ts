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

// eslint-disable-next-line @typescript-eslint/ban-types
export type Builtin = Date | Error | Function | Primitives | RegExp;
export type DeepRequired<T> = T extends Builtin
	? NonNullable<T>
	: T extends Map<infer K, infer V>
	? Map<DeepRequired<K>, DeepRequired<V>>
	: T extends ReadonlyMap<infer K, infer V>
	? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
	: T extends WeakMap<infer K, infer V>
	? WeakMap<DeepRequired<K>, DeepRequired<V>>
	: T extends Set<infer U>
	? Set<DeepRequired<U>>
	: T extends ReadonlySet<infer U>
	? ReadonlySet<DeepRequired<U>>
	: T extends WeakSet<infer U>
	? WeakSet<DeepRequired<U>>
	: T extends Promise<infer U>
	? Promise<DeepRequired<U>>
	// eslint-disable-next-line @typescript-eslint/ban-types
	: T extends {}
	? { [K in keyof T]-?: DeepRequired<T[K]> }
	: NonNullable<T>;
export type Primitives = bigint | boolean | null | number | string | symbol | undefined;
