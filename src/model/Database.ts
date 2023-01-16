import postgres from 'postgres';
import Config from './Config';
import fs from 'fs';
import path from 'path';
import { init } from '@emailjs/browser';

export default class Database {
	private static _instance: Database;
	private _client: postgres.Sql<{}>;
	private _accessors: DatabaseAccessor[] = [];

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

		setTimeout(() => {
			Database.clean();
		}, 10000);
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

	/**
	 * Nettoie la base de donnees, ajouter les méthodes
	 */
	private static async clean(): Promise<void> {
		if (Database._instance) {
			for (const accessor of Database._instance._accessors) {
				await accessor.clean();
			}
		}
	}

	public static registerAccessor(accessor: DatabaseAccessor) {
		Database._instance._accessors.push(accessor);
	}
}

export abstract class DatabaseAccessor {
	constructor() {
		this.register();
	}

	private register(): void {
		Database.registerAccessor(this);
	}

	abstract clean(): Promise<void>;
}
