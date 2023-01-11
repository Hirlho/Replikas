import Database from './Database';
import TMDB from './TMDB';

export default class Article {
	private id: number;
	private name: string;
	private description: string;
	private price: number;
	private min_bidding: number;
	private auction_start: Date;
	private auction_end: Date;
	private img_paths: string[] = [];
	private tmdb_movie_id: number;
	private selling_company_id: number;

	private constructor() {}

	private static async getFromResult(result: any): Promise<Article> {
		const database = Database.get();
		const article = new Article();
		article.id = result.art_id;
		article.name = result.art_name;
		article.description = result.art_description;
		article.price = result.art_price;
		article.min_bidding = result.art_min_bidding;
		article.auction_start = result.art_auction_start;
		article.auction_end = result.art_auction_end;
		article.tmdb_movie_id = result.m_id;
		article.selling_company_id = result.c_id;

		const imgs = await database`
			SELECT * FROM article_image WHERE art_id = ${article.id}`;
		for (const image of imgs) {
			article.img_paths.push(image.img_path);
		}

		return article;
	}

	public static async get(id: number): Promise<Article> {
		const database = Database.get();
		const result = await database`
            SELECT * FROM article WHERE art_id = ${id}`;
		if (result.count === 0) {
			throw new ArticleInexistantError(id);
		}
		return this.getFromResult(result[0]);
	}

	public static async create(
		name: string,
		description: string,
		price: number,
		min_bidding: number,
		auction_start: Date,
		auction_end: Date,
		img_paths: string[],
		tmdb_movie_id: number,
		selling_company_id: number
	): Promise<Article> {
		const movie = await TMDB.getMovie(tmdb_movie_id);
		const database = Database.get();
		const result = await database`
            INSERT INTO article (art_name, art_description, art_price, art_min_bidding, art_auction_start, art_auction_end, m_id, c_id) VALUES (${name}, ${description}, ${price}, ${min_bidding}, ${auction_start}, ${auction_end}, ${tmdb_movie_id}, ${selling_company_id}) RETURNING *`;

		for (const img_path of img_paths) {
			await database`
				INSERT INTO article_image (art_id, img_path) VALUES (${result[0].art_id}, ${img_path})`;
		}

		await database`
			INSERT INTO movie (m_id, m_title) VALUES (${tmdb_movie_id}, ${movie.title}) ON CONFLICT DO NOTHING`;

		return this.getFromResult(result[0]);
	}

	public static async getAll(): Promise<Article[]> {
		const database = Database.get();
		const result = await database`
			SELECT * FROM article`;
		const articles: Article[] = [];
		for (const article of result) {
			articles.push(await this.getFromResult(article));
		}

		return articles;
	}

	public static async getBySearch(
		search: string,
		params = { limit: 20, offset: 0 }
	): Promise<Article[]> {
		if (search == '@all') {
			return this.getAll();
		}
		const database = Database.get();
		// Cherche les articles dont le nom ou la description contient le mot recherché (ts_query, ts_vector, plainto_tsquery), triés par pertinence (ts_rank)
		const result = await database`
            SELECT 
                    a.*, 
                    rank_name,
                    rank_description,
                    rank_movie_title,
                    similarity
            FROM 
                    article a INNER JOIN movie c ON a.m_id = c.m_id,
                    to_tsvector(a.art_name || ' ' || a.art_description || ' ' || c.m_title) document,
                    websearch_to_tsquery(${search}) query,
                    NULLIF(ts_rank(to_tsvector(a.art_name), query), 0) rank_name,
                    NULLIF(ts_rank(to_tsvector(a.art_description), query), 0) rank_description,
                    NULLIF(ts_rank(to_tsvector(c.m_title), query), 0) rank_movie_title,
                    SIMILARITY(${search}, a.art_name || a.art_description) similarity
            WHERE
                    document @@ query OR similarity > 0.08
            ORDER BY
                    rank_name DESC, rank_description DESC, rank_movie_title DESC, similarity DESC
			LIMIT ${params.limit} OFFSET ${params.offset || 0}`;

		const articles: Article[] = [];
		for (const article of result) {
			articles.push(await this.getFromResult(article));
		}
		return articles;
	}

	public static async mostBids(
		params = { limit: 8, offset: 0 }
	): Promise<Article[]> {
		const database = Database.get();
		const result = await database`
				SELECT * 
				FROM article
				WHERE art_id IN (
					SELECT art_id
					FROM bid
					GROUP BY art_id
					ORDER BY count(art_id) DESC
					LIMIT ${params.limit || 8} OFFSET ${params.offset || 0}
					)`;
		const articles: Article[] = [];
		for (const article of result) {
			articles.push(await this.getFromResult(article));
		}
		return articles;
	}

	public static getFallback(id: number): Article {
		const article = new Article();
		article.id = null;
		article.name = `Article ${id} non trouvé`;
		article.description = `Cet article n'existe pas ou plus`;
		article.price = 0;
		article.min_bidding = 0;
		article.auction_start = new Date();
		article.auction_end = new Date();
		article.tmdb_movie_id = null;
		article.selling_company_id = null;
		article.img_paths = ['/img/article/placeholder.jpg'];

		return article;
	}

	public async delete(): Promise<void> {
		const database = Database.get();
		await database`DELETE FROM article WHERE art_id = ${this.id}`;
		await database`DELETE FROM article_image WHERE art_id = ${this.id}`;
	}

	public getId(): number {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getDescription(): string {
		return this.description;
	}

	public getPrixBase(): number {
		return this.price;
	}

	public getEncherissementMin(): number {
		return this.min_bidding;
	}

	public getDebutVente(): Date {
		return this.auction_start;
	}

	public getFinVente(): Date {
		return this.auction_end;
	}

	public getTmdbMovieId(): number {
		return this.tmdb_movie_id;
	}

	public getImages(): string[] {
		return this.img_paths;
	}

	public async getPoster(): Promise<string> {
		if (this.img_paths.length > 0) {
			return this.img_paths[0];
		} else {
			return await TMDB.getMoviePosterURL(this.tmdb_movie_id, 'w342').catch(
				() => {
					return '/img/article/placeholder.jpg';
				}
			);
		}
	}

	public getSellingCompanyId(): number {
		return this.selling_company_id;
	}
}

export class ArticleInexistantError extends Error {
	constructor(id: number) {
		super(`L'article ${id} n'existe pas`);
	}
}
