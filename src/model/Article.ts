import Database from "./Database";

export default class Article {
	private id: number;
	private name: string;
	private description: string;
	private prix_base: number;
	private encherissement_min: number;
	private debut_vente: Date;
	private fin_vente: Date;
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
		article.prix_base = result[0].art_prix_base;
		article.encherissement_min = result[0].art_encherissement_min;
		article.debut_vente = result[0].art_debut_vente;
		article.fin_vente = result[0].art_fin_vente;
		article.tmdb_movie_id = result[0].f_id;
		return article;
	}

	public static async create(
		name: string,
		description: string,
		prix: number,
		encherissement_min: number,
		debut_vente: Date,
		fin_vente: Date,
		tmdb_movie_id: number
	): Promise<Article> {
		const database = Database.get();
		const article = new Article();
		const result = await database`
            INSERT INTO article (art_name, art_description, art_prix_base, art_encherissement_min, art_debut_vente, art_fin_vente, f_id) VALUES (${name}, ${description}, ${prix}, ${encherissement_min}, ${debut_vente}, ${fin_vente}, ${tmdb_movie_id}) RETURNING art_id`;
		article.id = result[0].art_id;
		article.name = name;
		article.description = description;
		article.prix_base = prix;
		article.encherissement_min = encherissement_min;
		article.debut_vente = debut_vente;
		article.fin_vente = fin_vente;
		article.tmdb_movie_id = tmdb_movie_id;
		return article;
	}

	public static async getBySearch(search: string): Promise<Article[]> {
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
                    document @@ query OR similarity > 0
            ORDER BY
                    rank_name, rank_description DESC NULLS LAST`;

		const articles: Article[] = [];
		for (const article of result) {
			const art = new Article();
			art.id = article.art_id;
			art.name = article.art_name;
			art.description = article.art_description;
			art.prix_base = article.art_prix_base;
			art.encherissement_min = article.art_encherissement_min;
			art.debut_vente = article.art_debut_vente;
			art.fin_vente = article.art_fin_vente;
			art.tmdb_movie_id = article.f_id;
			articles.push(art);
		}
		return articles;
	}

	public async delete(): Promise<void> {
		const database = Database.get();
		await database`DELETE FROM article WHERE art_id = ${this.id}`;
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
		return this.prix_base;
	}

	public getEncherissementMin(): number {
		return this.encherissement_min;
	}

	public getDebutVente(): Date {
		return this.debut_vente;
	}

	public getFinVente(): Date {
		return this.fin_vente;
	}

	public getTmdbMovieId(): number {
		return this.tmdb_movie_id;
	}
}

export class ArticleInexistantError extends Error {
	constructor(id: number) {
		super(`L'article ${id} n'existe pas`);
	}
}
