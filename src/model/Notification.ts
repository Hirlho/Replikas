import Article from './Article';
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
