import Database from "../Database";
import { EtatInnatenduError } from "../Utilitaire";
import Account, { UtilisateurOuMotDePasseInvalideError, AccountTypeMismatch } from "./Account";

export default class Company extends Account {
	private name: string;

	public static async get(email: string, password: string): Promise<Company> {
		const account = await super.get(email, password);
		return this.getFromUtilisateur(account);
	}

	public static async getFromUtilisateur(account: Account): Promise<Company> {
		if (!account.isCompany()) {
			throw new AccountTypeMismatch("company");
		}
		const database = Database.get();
		const result = await database`SELECT * FROM company WHERE a_id = ${account.getId()}`;
		if (result.count === 0) {
			throw new EtatInnatenduError("L'utilisateur existe mais pas l'entreprise");
		}
		const company = new Company();
		company.id = account.getId();
		company.email = account.getEmail();
		company.created_at = account.getDateCreation();
		company.is_company = true;
		company.name = result[0].c_name;

		return company;
	}

	public static async createCompany(email: string, password: string, name: string): Promise<Company> {
		const account = await super.create(email, password);
		const database = Database.get();
		await database`INSERT INTO company (a_id, c_name) VALUES (${account.getId()}, ${name})`;
		const company = new Company();
		company.id = account.getId();
		company.email = account.getEmail();
		company.created_at = account.getDateCreation();
		company.is_company = true;
		company.name = name;

		return company;
	}

	public static async getBySession(token: string): Promise<Company> {
		const account = await super.getBySession(token);
		const database = Database.get();
		const result = await database`
			SELECT * FROM company WHERE a_id = ${account.getId()}`;
		if (result.count === 0) {
			throw new EtatInnatenduError("L'utilisateur n'a pas d'entreprise associée");
		}
		const company = new Company();
		company.id = account.getId();
		company.email = account.getEmail();
		company.created_at = account.getDateCreation();
		company.is_company = true;
		company.name = result[0].c_name;

		return company;
	}

	public getNom(): string {
		return this.name;
	}
}
