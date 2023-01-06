import Database from "../Database";
import shajs from "sha.js";

export default class Acheteur {
	static TABLE_NAME = "acheteurs";

	private id: number;
	private email: string;
	private nom: string;
	private prenom: string;

	private constructor() {
		this.email = "";
		this.nom = "";
		this.prenom = "";
	}

	public static async get(email: string, password: string): Promise<Acheteur> {
		const database = Database.get();
		const user = new Acheteur();
		const hash = shajs("sha256").update(password).digest("hex");
		const result = await database.query(
			`SELECT * FROM ${this.TABLE_NAME} WHERE a_mail = $1::text AND a_password = $2::text`,
			[email, hash]
		);
		if (result.rowCount === 0) {
			throw new UtilisateurOuMotDePasseInvalideError();
		}
		user.id = result.rows[0].a_id;
		user.email = result.rows[0].a_mail;
		user.nom = result.rows[0].nom;
		user.prenom = result.rows[0].prenom;

		return user;
	}

	public static async create(
		email: string,
		password: string,
		nom: string,
		prenom: string
	): Promise<Acheteur> {
		const database = Database.get();
		const user = new Acheteur();
		const hash = shajs("sha256").update(password).digest("hex");
		const result = await database
			.query(
				`INSERT INTO ${this.TABLE_NAME} (a_mail, a_password, nom, prenom) VALUES ($1::text, $2::text, $3::text, $4::text) RETURNING a_id`,
				[email, hash, nom, prenom]
			)
			.catch((err) => {
				// If the email is already in use, throw a more specific error
				if (err.code === "23505") {
					throw new EmailDejaUtiliseError();
				}
				throw err;
			});
		console.info("Created user with id " + result.rows[0].a_id);
		user.id = result.rows[0].a_id;
		user.email = email;
		user.nom = nom;
		user.prenom = prenom;

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
