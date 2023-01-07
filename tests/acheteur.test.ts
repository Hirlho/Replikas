import Database from "../src/model/Database";
import Acheteur, {
	UtilisateurOuMotDePasseInvalideError,
} from "../src/model/users/Acheteur";

test("Crée un utilisateur et lui assigne un id automatiquement", async () => {
	const user = await Acheteur.create(
		"elon.musk@teslamotors.com",
		"ILoveTesla",
		"Musk",
		"Elon"
	);
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

afterAll(async () => {
	const database = Database.get();

	await database.query(
		`DELETE FROM ${Acheteur.TABLE_NAME} WHERE a_mail = $1::text`,
		["elon.musk@teslamotors.com"]
	);

	await database.end();
});
