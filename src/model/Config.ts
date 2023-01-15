import { config } from 'dotenv';
config();

function getEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new UndefinedConfigEntry(key);
	}
	return value;
}

export class UndefinedConfigEntry extends Error {
	constructor(key: string) {
		super(`La variable d'environnement (.env) ${key} n'est pas définie`);
	}
}

type ConfigType = {
	tmdb: {
		apiKey: string;
	};
	db: {
		host: string;
		port: number;
		user: string;
		password: string;
		name: string;
	};
};

export default class Config {
	private static _instance: Config;
	private _config: ConfigType;

	private constructor() {
		this._config = {
			tmdb: {
				apiKey: getEnv('TMDB_API_KEY'),
			},
			db: {
				host: getEnv('DB_HOST'),
				port: parseInt(getEnv('DB_PORT')),
				user: getEnv('DB_USER'),
				password: getEnv('DB_PASS'),
				name: getEnv('DB_NAME'),
			},
		};
	}

	/**
	 * Recupere le singleton de la classe Config
	 * @returns L'instance de la classe Config
	 */
	public static get(): ConfigType {
		if (!Config._instance) {
			Config._instance = new Config();
		}
		return Config._instance._config;
	}
}
