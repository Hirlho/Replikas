import Article from './Article';
import Bids from './Bids';
import Database from './Database';
import Buyer from './users/Buyer';
import Company from './users/Company';

export default class Notification {
	private id: number;
	private account_id: number;
	private date: Date;
	private text: string;

	private constructor(
		id: number,
		account_id: number,
		date: Date,
		text: string
	) {
		this.id = id;
		this.account_id = account_id;
		this.date = date;
		this.text = text;
	}

	public static async getUserNotifications(
		user_id: number
	): Promise<Notification[]> {
		const database = Database.get();
		const result = await database`
				SELECT * FROM notification WHERE a_id = ${user_id} ORDER BY n_date DESC `;
		const notifications: Notification[] = [];
		for (const notif of result) {
			notifications.push(
				new Notification(notif.n_id, notif.a_id, notif.n_date, notif.n_text)
			);
		}
		return notifications;
	}

	public static async notifyArticleStart(article: Article): Promise<void> {
		const database = Database.get();
		// Notifier les acheteurs intéressés
		console.log(article);
		const result = await database`
				SELECT * FROM interests where art_id = ${article.getId()}`;
		for (const interest of result) {
			await database`
					INSERT INTO notification (a_id, n_date, n_text) 
					VALUES (${interest.b_id}, ${new Date()}, ${
				'L\'enchère de votre article mis en favori "' +
				article.getName() +
				'" a commencé !'
			})`;
		}
		// Notifier l'entreprise qui a mis l'article en vente
		await database`
				INSERT INTO notification (a_id, n_date, n_text)
				VALUES (${article.getSellingCompanyId()}, ${new Date()}, ${
			'L\'enchère de votre article "' + article.getName() + '" a commencé !'
		})`;
	}

	public static async notifyArticleEnd(article: Article): Promise<void> {
		const database = Database.get();
		const winner = await Bids.getEncherisseurGagnant(article);
		if (winner) {
			// Notifier l'acheteur gagnant
			await database`
					INSERT INTO notification (a_id, n_date, n_text)
					VALUES (${winner.getId()}, ${new Date()}, ${
				"Vous avez gagné l'enchère de l'article \"" +
				article.getName() +
				'" !\n' +
				'Rendez-vous dans la page "Mes Articles" pour voir les détails de la transaction.'
			})`;
			// Notifier l'entreprise qui a mis l'article en vente
			await database`
					INSERT INTO notification (a_id, n_date, n_text)
					VALUES (${article.getSellingCompanyId()}, ${new Date()}, ${
				'Votre article "' +
				article.getName() +
				'" a été vendu à ' +
				winner.toString() +
				' pour ' +
				(await Bids.getEnchereMax(article)) +
				'€ !\n' +
				'Vous recevrez prochainement votre paiement.'
			})`;
		} else {
			// Notifier l'entreprise qui a mis l'article en vente
			await database`
					INSERT INTO notification (a_id, n_date, n_text)
					VALUES (${article.getSellingCompanyId()}, ${new Date()}, ${
				'Votre article "' +
				article.getName() +
				'" n\'a pas été vendu !\n' +
				'Vous pouvez prolonger l\'enchère dans la page "Mes Articles". Il sera supprimé automatiquement dans 7 jours.'
			})`;
		}
	}

	// Getters
	public getId(): number {
		return this.id;
	}

	public getAccountId(): number {
		return this.account_id;
	}

	public getDate(): Date {
		return this.date;
	}

	public getText(): string {
		return this.text;
	}
}
