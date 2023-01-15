import postgres from 'postgres';
import Config from './Config';
import fs from 'fs';
import path from 'path';

export default class Database {
	private static _instance: Database;
	private _client: postgres.Sql<{}>;

	private constructor() {
		const config = Config.get().db;
		this._client = postgres({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.name,
			idle_timeout: 20,
		});

		this._client.subscribe('delete:article_image', (row: postgres.Row) => {
			console.log('delete:article_image', row);
			const file_path = path.join(Config.get().uploads_dir, row.name);
			try {
				fs.unlinkSync(file_path);
			} catch (e) {
				console.error(
					'[UPLOAD_IMAGE_DELETE] Error while deleting file',
					file_path,
					e
				);
			}
		});
	}

	/**
	 * Recupere le singleton de la classe Database
	 * @returns L'instance de la classe Database
	 */
	public static get(): postgres.Sql<{}> {
		if (!Database._instance) {
			Database._instance = new Database();
		}
		return Database._instance._client;
	}

	/**
	 * Ferme la connexion avec la base de donnees
	 */
	public static async close(): Promise<void> {
		if (Database._instance) {
			await Database._instance._client.end();
		}
	}
}
