import Article from "../src/model/Article";
import Database from "../src/model/Database";

test("Crée un article et lui assigne un id automatiquement", async () => {
	const article = await Article.create(
		"Sabre laser",
		"Un sabre laser de la marque Jedi, utilisé par Darth Vader dans l'épisode 4 de la saga Star Wars. @test-product",
		1000,
		1,
		new Date("2020-01-01"),
		new Date("2020-01-02"),
		1
	);
	expect(article.getId()).toBeGreaterThan(0);
});

test("Récupère un article existant", async () => {
	const article = await Article.create(
		"Sabre laser",
		"Un sabre laser de la marque Jedi, utilisé par maître Yoda dans l'épisode 4 de la saga Star Wars. @test-product",
		1000,
		1,
		new Date("2020-01-01"),
		new Date("2020-01-02"),
		1
	);
	const article2 = await Article.get(article.getId());
	expect(article2.getId()).toBe(article.getId());
});

test("Cherche des article", async () => {
	const resultats = await Article.getBySearch("sabre");
	expect(resultats.length).toBeGreaterThanOrEqual(2);

	const resultats2 = await Article.getBySearch("star wars");
	expect(resultats2.length).toBeGreaterThanOrEqual(2);

	const resultats3 = await Article.getBySearch("yoda");
	expect(resultats3.length).toBeGreaterThanOrEqual(1);
});

test("Cherche des article avec bon ordre de pertinence", async () => {
	const resultats = await Article.getBySearch("sabre yoda");
	expect(resultats[0].getDescription()).toContain("Yoda");
	expect(resultats[1].getDescription()).toContain("Vader");

	const resultats2 = await Article.getBySearch("sabre star wars vader");
	expect(resultats2[0].getDescription()).toContain("Vader");
	expect(resultats2[1].getDescription()).toContain("Yoda");
});

afterAll(async () => {
	const articles_crees = await Article.getBySearch("@test-product");
	for (const article of articles_crees) {
		await article.delete();
	}
	await Database.close();
});
