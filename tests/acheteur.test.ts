import Database from "../src/model/Database";
import Acheteur, { UtilisateurOuMotDePasseInvalideError } from "../src/model/users/Acheteur";

test("Crée un utilisateur et lui assigne un id automatiquement", async () => {
	const user = await Acheteur.create("elon.musk@teslamotors.com", "ILoveTesla", "Musk", "Elon");
	expect(user.getId()).toBeGreaterThan(0);
});

test("Récupère un utilisateur existant", async () => {
	const user = await Acheteur.get("elon.musk@teslamotors.com", "ILoveTesla");
	expect(user.getId()).toBeGreaterThan(0);
});

test("Renvoie une erreur si l'utilisateur n'existe pas", async () => {
	await expect(async () => {
		await Acheteur.get("elon.musk@teslamotorze.com", "ILoveTesla");
	}).rejects.toThrowError(UtilisateurOuMotDePasseInvalideError);
});

test("Renvoie une erreur si le mot de passe est incorrect", async () => {
	await expect(async () => {
		await Acheteur.get("elon.musk@teslamotors.com", "IHateTesla");
	}).rejects.toThrowError(UtilisateurOuMotDePasseInvalideError);
});

test("Crée le token de session", async () => {
	const user = await Acheteur.get("elon.musk@teslamotors.com", "ILoveTesla");
	const token = await user.createSession();

	const database = Database.get();
	const result = await database`SELECT * FROM session WHERE s_token = ${token}`;
	expect(result.count).toBe(1);
});

test("Récupère l'utilisateur à partir du token de session", async () => {
	const user = await Acheteur.get("elon.musk@teslamotors.com", "ILoveTesla");
	const token = await user.createSession();
	const user2 = await Acheteur.getBySession(token);
	expect(user2.getId()).toBe(user.getId());
});

afterAll(async () => {
	const database = Database.get();

	const elon_ids = await database`SELECT a_id FROM acheteur WHERE a_mail = 'elon.musk@teslamotors.com'`;
	for (const elon_id of elon_ids) {
		await database`DELETE FROM session WHERE a_id = ${elon_id.a_id}`;
	}
	await database`DELETE FROM acheteur WHERE a_mail = 'elon.musk@teslamotors.com'`;

	await Database.close();
});
