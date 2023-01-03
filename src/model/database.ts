import { Client } from "pg";
import Config from "./config.js";

export default class Database {
	private static _instance: Database;
	private _client: Client;

	private constructor() {
		const config = Config.get().db;
		this._client = new Client({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.database,
		});

		this._client.connect((err) => {
			if (err) {
				throw err;
			} else {
				this._client.connected = true;
				console.info("Connected to database");
			}
		});
	}

	public static get(): Client {
		if (!Database._instance) {
			Database._instance = new Database();
		}
		return Database._instance._client;
	}
}
