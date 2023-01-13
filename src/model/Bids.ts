import Article from './Article';
import Database from './Database';
import Buyer from './users/Buyer';

export default class Bids {
	/**
	 * Récupère l'enchère max d'un article
	 * @param article L'{@link Article} sur lequel on veut récupérer l'enchère max
	 * @returns L'enchère max, ou le prix de base si aucune enchère n'a été faite
	 */
	public static async getEnchereMax(article: Article): Promise<number> {
		const database = Database.get();
		const enchere =
			await database`SELECT MAX(amount) as amount FROM bid WHERE art_id = ${article.getId()}`;
		if (enchere[0].amount === null) {
			return article.getPrixBase();
		}
		return enchere[0].amount;
	}

	/**
	 * Place une enchère sur un article, ne vérifie pas si l'enchère est valide
	 * @param article L'{@link Article} sur lequel on veut placer l'enchère
	 * @param amount Le montant de l'enchère
	 * @param buyer Le {@link Buyer} qui fait l'enchère
	 */
	public static async placerEnchere(
		article: Article,
		amount: number,
		buyer: Buyer
	): Promise<void> {
		const database = Database.get();
		await database`INSERT INTO bid (art_id, b_id, amount) VALUES (${article.getId()}, ${buyer.getId()}, ${amount})`;
	}

	/**
	 * Recupère l'enchérisseur gagnant d'un article
	 * @param article L'{@link Article} sur lequel on veut récupérer l'enchérisseur gagnant
	 * @returns L'enchérisseur gagnant ({@link Buyer})
	 * @throws RangeError si aucune enchère n'a été faite sur l'article
	 */
	public static async getEncherisseurGagnant(article: Article): Promise<Buyer> {
		const database = Database.get();
		const enchere =
			await database`SELECT b_id FROM bid WHERE art_id = ${article.getId()} SORT BY amount DESC LIMIT 1`;
		if (enchere.length === 0) {
			throw new RangeError('Aucune enchère pour cet article');
		}
		return await Buyer.getById(enchere[0].b_id);
	}
}
