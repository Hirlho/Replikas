import Database from "../Database";
import shajs from "sha.js";

export default class Account {
	static SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

	protected id: number;
	protected email: string;
	protected created_at: Date;
	protected is_company: boolean;

	protected constructor() {}

	/**
	 * Récupère un utilisateur à partir de son email et de son mot de passe.
	 * @param email L'email de l'utilisateur sert de login
	 * @param password Le mot de passe de l'utilisateur non haché
	 * @returns L'utilisateur correspondant à l'email et au mot de passe
	 * @throws {UtilisateurOuMotDePasseInvalideError} Si l'email ou le mot de passe est invalide
	 */
	protected static async get(email: string, password: string): Promise<Account> {
		const database = Database.get();
		const user = new Account();
		const hash = shajs("sha256").update(password).digest("hex");
		const result = await database`
			SELECT * FROM account WHERE a_login = ${email} AND a_password = ${hash}`;
		if (result.count === 0) {
			throw new UtilisateurOuMotDePasseInvalideError();
		}
		user.id = result[0].a_id;
		user.email = result[0].a_mail;
		user.created_at = result[0].a_created_at;
		user.is_company = result[0].a_is_company;

		return user;
	}

	/**
	 * Crée un nouvel utilisateur. Ne doit être appelé que par les classes filles.
	 * @param email L'email de l'utilisateur sert de login
	 * @param password Le mot de passe de l'utilisateur, il sera haché en SHA-256 dans la base de données
	 * @param nom Le nom de l'utilisateur
	 * @param prenom Le prénom de l'utilisateur
	 * @returns L'utilisateur nouvellement créé
	 * @throws {EmailDejaUtiliseError} Si l'email est déjà utilisé
	 */
	protected static async create(email: string, password: string, is_company: boolean = false): Promise<Account> {
		const database = Database.get();
		const account = new Account();
		const hash = shajs("sha256").update(password).digest("hex");

		const result = await database`
			INSERT INTO account (a_login, a_password, a_created_at, a_is_company) VALUES (${email}, ${hash}, ${new Date()}, ${is_company}) RETURNING a_id`.catch(
			(err) => {
				// If the email is already in use, throw a more specific error
				if (err.code === "23505") {
					throw new EmailDejaUtiliseError();
				}
				throw err;
			}
		);
		console.info("Created user with id " + result[0].a_id);
		account.id = result[0].a_id;
		account.email = email;
		account.created_at = new Date();
		account.is_company = is_company;

		return account;
	}

	/**
	 * Crée une session pour l'utilisateur permettant de s'authentifier sur le site sans avoir à renseigner son mot de passe grâce à la méthode {@link Account.getBySession}.
	 * @returns Le token de la session
	 */
	public async createSession(): Promise<string> {
		const database = Database.get();
		const token = shajs("sha256")
			.update("" + this.getId() + Date.now())
			.digest("hex");
		const dateCreation = new Date();
		const dateExpiration = new Date(dateCreation.getTime() + Account.SESSION_DURATION * 1000);

		return database`
			INSERT INTO session (s_token, s_created_at, s_expires_at, a_id) VALUES (${token}, ${dateCreation}, ${dateExpiration}, ${this.getId()})`.then(
			() => token
		);
	}

	/**
	 * Récupère un utilisateur à partir de son token de session.
	 * @param token Le token de session
	 * @returns L'utilisateur correspondant au token de session
	 * @throws {SessionTokenInvalideError} Si le token de session est invalide ou expiré
	 * @throws {CaCestVraimentPasDeBolError} Si plusieurs sessions sont créées pour un même utilisateur avec le même token
	 */
	protected static async getBySession(token: string): Promise<Account> {
		const database = Database.get();
		const account = new Account();
		const result = await database`
			SELECT * FROM account INNER JOIN session ON account.a_id = session.a_id WHERE s_token = ${token}`;
		if (result.count === 0) {
			throw new SessionTokenInvalideError();
		} else if (result[0].s_expires_at < new Date()) {
			throw new SessionTokenInvalideError();
		} else if (result.count > 1) {
			throw new CaCestVraimentPasDeBolError(); // Supprimer dans la version finale
		}

		account.id = result[0].a_id;
		account.email = result[0].a_mail;
		account.created_at = result[0].a_created_at;
		account.is_company = result[0].a_is_company;

		return account;
	}

	protected async delete(): Promise<void> {
		const database = Database.get();
		await database`DELETE FROM account WHERE a_id = ${this.getId()}`;
	}

	protected static async deleteSession(token: string): Promise<void> {
		const database = Database.get();
		await database`DELETE FROM session WHERE s_token = ${token}`;
	}

	public getId(): number {
		return this.id;
	}

	public getEmail(): string {
		return this.email;
	}

	public getDateCreation(): Date {
		return this.created_at;
	}

	public isCompany(): boolean {
		return this.is_company;
	}
}

export class UtilisateurOuMotDePasseInvalideError extends Error {
	constructor() {
		super("Utilisateur ou mot de passe invalide");
	}
}

export class EmailDejaUtiliseError extends Error {
	constructor() {
		super("Email déjà utilisé");
	}
}

export class SessionTokenInvalideError extends Error {
	constructor() {
		super("Token  de session invalide invalide");
	}
}

export class CaCestVraimentPasDeBolError extends Error {
	constructor() {
		super("C'est vraiment pas de bol");
	}
}

export class AccountTypeMismatch extends Error {
	constructor(required: "buyer" | "company") {
		super(
			`Essayé d'utiliser un compte utilisateur ${
				{ buyer: "company", company: "buyer" }[required]
			} sur une méthode qui demandait un ${required}`
		);
	}
}
