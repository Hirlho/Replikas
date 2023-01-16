import Article from '../src/model/Article';
import Database from '../src/model/Database';
import TMDB from '../src/model/TMDB';

test('/search', async () => {
	const response = await fetch('/search?query=fight+club');
	expect(response.status).toBe(200);
	expect(response.headers.get('content-type')).toBe('application/json');
	const data = await response.json();
	expect(data.length).toBeGreaterThanOrEqual(1);
	expect(data[0]).toHaveProperty('id', 550);
});

test('/article/[id]/info', async () => {
	// First, we need to create an article
	const article = await Article.create(
		'Sabre laser',
		"Un sabre laser de la marque Jedi, utilisé par maître Yoda dans l'épisode 4. @test-product",
		1000,
		1,
		new Date('2020-01-01'),
		new Date('2020-01-02'),
		[],
		(
			await TMDB.searchMovie('star wars')
		)[0].id,
		1
	);
	// Then, we can test the API
	const response = await fetch(`/article/${article.getId()}/info`);
	expect(response.status).toBe(200);
	expect(response.headers.get('content-type')).toBe('application/json');
	const data = await response.json();
	expect(data).toHaveProperty('max_bid', 1000);
});

test('/article/[id]/like', async () => {
    // First, we need to create an article
    const article = await Article.create(
        'Sabre laser',
        "Un sabre laser de la marque Jedi, utilisé par maître Yoda dans l'épisode 4. @test-product",
        1000,
        1,
        new Date('2020-01-01'),
        new Date('2020-01-02'),
        [],
        (
            await TMDB.searchMovie('star wars')
        )[0].id,
        1
    );
    // Then, we can test the API
    const response = await fetch(`/article/${article.getId()}/like`, {
        method: 'PUT',
    });
    expect(response.status).toBe(200);


afterAll(async () => {
	const articles_crees = await Article.getBySearch('@test-product');
	for (const article of articles_crees) {
		await article.delete();
	}
	await Database.close();
});
