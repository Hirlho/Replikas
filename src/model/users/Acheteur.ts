import Database from "../Database";
import shajs from "sha.js";

export default class Acheteur {
	static SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

	private id: number;
	private email: string;
	private nom: string;
	private prenom: string;
	private date_creation: Date;

	private constructor() {
		this.email = "";
		this.nom = "";
		this.prenom = "";
	}

	public static async get(email: string, password: string): Promise<Acheteur> {
		const database = Database.get();
		const user = new Acheteur();
		const hash = shajs("sha256").update(password).digest("hex");
		const result = await database`
			SELECT * FROM acheteur WHERE a_mail = ${email} AND a_password = ${hash}`;
		if (result.count === 0) {
			throw new UtilisateurOuMotDePasseInvalideError();
		}
		user.id = result[0].a_id;
		user.email = result[0].a_mail;
		user.nom = result[0].a_nom;
		user.prenom = result[0].a_prenom;
		user.date_creation = result[0].a_date_creation_compte;

		return user;
	}

	public static async create(email: string, password: string, nom: string, prenom: string): Promise<Acheteur> {
		const database = Database.get();
		const user = new Acheteur();
		const hash = shajs("sha256").update(password).digest("hex");
		const result = await database`
			INSERT INTO acheteur (a_mail, a_password, a_nom, a_prenom, a_date_creation_compte) VALUES (${email}, ${hash}, ${nom}, ${prenom}, ${new Date()}) RETURNING a_id`.catch(
			(err) => {
				// If the email is already in use, throw a more specific error
				if (err.code === "23505") {
					throw new EmailDejaUtiliseError();
				}
				throw err;
			}
		);
		console.info("Created user with id " + result[0].a_id);
		user.id = result[0].a_id;
		user.email = email;
		user.nom = nom;
		user.prenom = prenom;

		return user;
	}

	public async createSession(): Promise<string> {
		const database = Database.get();
		const token = shajs("sha256")
			.update("" + this.getId() + Date.now())
			.digest("hex");
		const dateCreation = new Date();
		const dateExpiration = new Date(dateCreation.getTime() + Acheteur.SESSION_DURATION * 1000);

		return database`
			INSERT INTO session (s_token, s_date_creation, s_date_expiration, a_id) VALUES (${token}, ${dateCreation}, ${dateExpiration}, ${this.getId()})`.then(
			() => token
		);
	}

	public static async getBySession(token: string): Promise<Acheteur> {
		const database = Database.get();
		const user = new Acheteur();
		const result = await database`
			SELECT * FROM acheteur INNER JOIN session ON acheteur.a_id = session.a_id WHERE s_token = ${token}`;
		if (result.count === 0) {
			throw new SessionTokenInvalideError();
		} else if (result[0].s_date_expiration < new Date()) {
			throw new SessionTokenInvalideError();
		} else if (result.count > 1) {
			throw new CaCestVraimentPasDeBolError(); // Supprimer dans la version finale
		}

		user.id = result[0].a_id;
		user.email = result[0].a_mail;
		user.nom = result[0].a_nom;
		user.prenom = result[0].a_prenom;
		user.date_creation = result[0].a_date_creation_compte;

		return user;
	}

	public getId(): number {
		return this.id;
	}

	public getEmail(): string {
		return this.email;
	}

	public getNom(): string {
		return this.nom;
	}

	public getPrenom(): string {
		return this.prenom;
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
