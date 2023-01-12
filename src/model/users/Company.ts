import Database from '../Database';
import { EtatInnatenduError } from '../Utilitaire';
import Account, {
	UtilisateurOuMotDePasseInvalideError,
	AccountTypeMismatch,
} from './Account';

export default class Company extends Account {
	private name: string;

	/**
	 * @inheritdoc Account.get
	 * @throws {A@link ccountTypeMismatch} Si l'account n'est pas une entreprise mais un acheteur
	 */
	public static async get(email: string, password: string): Promise<Company> {
		const account = await super.get(email, password);
		return this.getFromAccount(account);
	}

	/**
	 * Convertit un account en entreprise
	 * @param account L'account à convertir en entreprise
	 * @returns L'entreprise correspondant à l'account
	 * @throws {@link AccountTypeMismatch} Si l'account n'est pas une entreprise mais un acheteur
	 * @throws {@link EtatInnatenduError} Si l'account existe mais pas l'entreprise
	 */
	public static async getFromAccount(account: Account): Promise<Company> {
		if (!account.isCompany()) {
			throw new AccountTypeMismatch('company');
		}
		const database = Database.get();
		const result =
			await database`SELECT * FROM company WHERE a_id = ${account.getId()}`;
		if (result.count === 0) {
			throw new EtatInnatenduError(
				"L'utilisateur existe mais pas l'entreprise"
			);
		}
		const company = new Company();
		company.id = account.getId();
		company.email = account.getEmail();
		company.created_at = account.getDateCreation();
		company.is_company = true;
		company.name = result[0].c_name;

		return company;
	}

	/**
	 * @inheritdoc Account.getById
	 * @throws {@link AccountTypeMismatch} Si l'account n'est pas une entreprise mais un acheteur
	 */
	public static async getById(id: number): Promise<Company> {
		const account = await super.getById(id);
		return this.getFromAccount(account);
	}

	/**
	 * Crée une entreprise et son compte correspondant
	 * @param email L'adresse courriel de l'entreprise
	 * @param password Le mot de passe du compte
	 * @param name Le nom de l'entreprise
	 * @returns L'entreprise créée
	 * @throws {@link EmailDejaUtiliseError} Si l'adresse courriel est déjà utilisée
	 */
	public static async createCompany(
		email: string,
		password: string,
		name: string
	): Promise<Company> {
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

	/**
	 * @inheritdoc Account.getBySession
	 * @throws {@link AccountTypeMismatch} Si l'account n'est pas une entreprise mais un acheteur
	 */
	public static async getBySession(token: string): Promise<Company> {
		const account = await super.getBySession(token);
		return this.getFromAccount(account);
	}

	public getNom(): string {
		return this.name;
	}

	public toString(): string {
		return this.name;
	}
}
