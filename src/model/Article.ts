import Database from "./Database";

export default class Article {
	private id: number;
	private name: string;
	private description: string;
	private price: number;
	private min_bidding: number;
	private auction_start: Date;
	private auction_end: Date;
	private img_paths: string[];
	private tmdb_movie_id: number;

	private constructor() {}

	public static async get(id: number): Promise<Article> {
		const database = Database.get();
		const article = new Article();
		const result = await database`
            SELECT * FROM article WHERE art_id = ${id}`;
		if (result.count === 0) {
			throw new ArticleInexistantError(id);
		}
		article.id = result[0].art_id;
		article.name = result[0].art_name;
		article.description = result[0].art_description;
		article.price = result[0].art_price;
		article.min_bidding = result[0].art_min_bidding;
		article.auction_start = result[0].art_auction_start;
		article.auction_end = result[0].art_auction_end;
		article.tmdb_movie_id = result[0].f_id;

		const imgs = await database`
			SELECT * FROM article_image WHERE art_id = ${id}`;
		for (const image of imgs) {
			article.img_paths.push(image.img_path);
		}

		return article;
	}

	public static async create(
		name: string,
		description: string,
		price: number,
		min_bidding: number,
		auction_start: Date,
		auction_end: Date,
		img_paths: string[],
		tmdb_movie_id: number
	): Promise<Article> {
		const database = Database.get();
		const article = new Article();
		const result = await database`
            INSERT INTO article (art_name, art_description, art_price, art_min_bidding, art_auction_start, art_auction_end, f_id) VALUES (${name}, ${description}, ${price}, ${min_bidding}, ${auction_start}, ${auction_end}, ${tmdb_movie_id}) RETURNING art_id`;
		article.id = result[0].art_id;
		article.name = name;
		article.description = description;
		article.price = price;
		article.min_bidding = min_bidding;
		article.auction_start = auction_start;
		article.auction_end = auction_end;
		article.img_paths = img_paths;
		article.tmdb_movie_id = tmdb_movie_id;

		for (const img_path of img_paths) {
			await database`
				INSERT INTO article_image (art_id, img_path) VALUES (${article.id}, ${img_path})`;
		}

		return article;
	}

	public static async getBySearch(search: string, params = { limit: 20, offset: 0 }): Promise<Article[]> {
		const database = Database.get();
		// Cherche les articles dont le nom ou la description contient le mot recherché (ts_query, ts_vector, plainto_tsquery), triés par pertinence (ts_rank)
		const result = await database`
            SELECT 
                    a.*, 
                    rank_name,
                    rank_description,
                    similarity
            FROM 
                    article a,
                    to_tsvector(a.art_name || ' ' || a.art_description) document,
                    plainto_tsquery(${search}) query,
                    NULLIF(ts_rank(to_tsvector(a.art_name), query), 0) rank_name,
                    NULLIF(ts_rank(to_tsvector(a.art_description), query), 0) rank_description,
                    SIMILARITY(${search}, a.art_name || a.art_description) similarity
            WHERE
                    document @@ query OR similarity > 0.1
            ORDER BY
                    rank_name, rank_description DESC NULLS LAST
			LIMIT ${params.limit} OFFSET ${params.offset}`;

		const articles: Article[] = [];
		for (const article of result) {
			const art = new Article();
			art.id = article.art_id;
			art.name = article.art_name;
			art.description = article.art_description;
			art.price = article.art_price;
			art.min_bidding = article.art_min_bidding;
			art.auction_start = article.art_auction_start;
			art.auction_end = article.art_auction_end;
			art.tmdb_movie_id = article.f_id;

			const imgs = await database`
			SELECT * FROM article_image WHERE art_id = ${art.id}`;
			for (const image of imgs) {
				art.img_paths.push(image.img_path);
			}

			articles.push(art);
		}
		return articles;
	}

	public static async mostBids(): Promise<Article[]> {
		const database = Database.get();
		const result = await database`
				SELECT * 
				FROM article
				WHERE art_id IN (
					SELECT art_id
					FROM bid
					GROUP BY art_id
					ORDER BY count(art_id) DESC
					LIMIT 8
					)`;
		const articles: Article[] = [];
		for (const article of result) {
			const art = new Article();
			art.id = article.art_id;
			art.name = article.art_name;
			art.description = article.art_description;
			art.price = article.art_prix_base;
			art.min_bidding = article.art_encherissement_min;
			art.auction_start = article.art_debut_vente;
			art.auction_end = article.art_fin_vente;
			art.tmdb_movie_id = article.f_id;

			const imgs = await database`
				  SELECT * FROM article_image WHERE art_id = ${art.id}`;
			for (const image of imgs) {
				art.img_paths.push(image.img_path);
			}

			articles.push(art);
		}
		return articles;
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
}

export class ArticleInexistantError extends Error {
	constructor(id: number) {
		super(`L'article ${id} n'existe pas`);
	}
}
