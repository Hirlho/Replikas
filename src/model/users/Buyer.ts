import Database from "../Database";
import { EtatInnatenduError } from "../Utilitaire";
import Account, { UtilisateurOuMotDePasseInvalideError, AccountTypeMismatch } from "./Account";

export default class Buyer extends Account {
	private last_name: string;
	private first_name: string;

	public static async get(email: string, password: string): Promise<Buyer> {
		const account = await super.get(email, password);
		return this.getFromAccount(account);
	}

	public static async getFromAccount(account: Account): Promise<Buyer> {
		if (account.isCompany()) {
			throw new AccountTypeMismatch("buyer");
		}
		const database = Database.get();
		const result = await database`SELECT * FROM buyer WHERE a_id = ${account.getId()}`;
		if (result.count === 0) {
			throw new EtatInnatenduError("L'utilisateur existe mais pas l'acheteur");
		}
		const buyer = new Buyer();
		buyer.id = account.getId();
		buyer.email = account.getEmail();
		buyer.created_at = account.getDateCreation();
		buyer.is_company = false;
		buyer.last_name = result[0].b_last_name;
		buyer.first_name = result[0].b_first_name;

		return buyer;
	}

	public static async createBuyer(
		email: string,
		password: string,
		last_name: string,
		first_name: string
	): Promise<Buyer> {
		const account = await super.create(email, password);
		const database = Database.get();
		await database`INSERT INTO buyer (a_id, b_last_name, b_first_name) VALUES (${account.getId()}, ${last_name}, ${first_name})`;
		const buyer = new Buyer();
		buyer.id = account.getId();
		buyer.email = account.getEmail();
		buyer.created_at = account.getDateCreation();
		buyer.is_company = false;
		buyer.last_name = last_name;
		buyer.first_name = first_name;

		return buyer;
	}

	public static async getBySession(token: string): Promise<Buyer> {
		const account = await super.getBySession(token);
		const database = Database.get();
		const result = await database`
			SELECT * FROM buyer WHERE a_id = ${account.getId()}`;
		if (result.count === 0) {
			throw new EtatInnatenduError("L'utilisateur n'a pas d'acheteur associé");
		}
		const buyer = new Buyer();
		buyer.id = account.getId();
		buyer.email = account.getEmail();
		buyer.created_at = account.getDateCreation();
		buyer.is_company = false;
		buyer.last_name = result[0].b_last_name;
		buyer.first_name = result[0].b_first_name;

		return buyer;
	}

	public getNom(): string {
		return this.last_name;
	}

	public getPrenom(): string {
		return this.first_name;
	}

	public toString(): string {
		return `${this.first_name} ${this.last_name}`;
	}
}
