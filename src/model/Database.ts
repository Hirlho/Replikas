import pg from "pg";
import Config from "./Config";

export default class Database {
	private static _instance: Database;
	private _client: pg.Client;

	private constructor() {
		const config = Config.get().db;
		this._client = new pg.Client({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.name,
		});

		this._client.connect((err) => {
			if (err) {
				throw err;
			} else {
				console.info("Connected to database");
			}
		});
	}

	public static get(): pg.Client {
		if (!Database._instance) {
			Database._instance = new Database();
		}
		return Database._instance._client;
	}

	public static async close(): Promise<void> {
		if (Database._instance) {
			await Database._instance._client.end();
		}
	}
}
