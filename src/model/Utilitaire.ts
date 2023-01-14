import Account, {
	SessionTokenInvalideError,
	CaCestVraimentPasDeBolError,
	AccountTypeMismatch,
} from './users/Account';
import Buyer from './users/Buyer';
import Company from './users/Company';
import path from 'path';
import fs from 'fs';
import stream from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'node:stream';

export { dateDiff };

/**
 * Retourne la difference entre 2 dates
 * @param date1
 * @param date2
 * @returns La difference entre les 2 dates en jour, heure, minute et seconde
 */
function dateDiff(
	date1: Date,
	date2: Date
): { day: number; hour: number; min: number; sec: number } {
	var diff = {
		sec: 0,
		min: 0,
		hour: 0,
		day: 0,
	};
	var diff_temps = date1.getTime() - date2.getTime();

	diff_temps = Math.floor(diff_temps / 1000); // Nombre de secondes entre les 2 dates
	diff.sec = diff_temps % 60; // Extraction du nombre de secondes

	diff_temps = Math.floor((diff_temps - diff.sec) / 60); // Nombre de minutes (partie entière)
	diff.min = diff_temps % 60; // Extraction du nombre de minutes

	diff_temps = Math.floor((diff_temps - diff.min) / 60); // Nombre d'heures (entières)
	diff.hour = diff_temps % 24; // Extraction du nombre d'heures

	diff_temps = Math.floor((diff_temps - diff.hour) / 24); // Nombre de jours restants
	diff.day = diff_temps;

	return diff;
}

/**
 * Ajoute un cookie aux headers d'une réponse
 * @param headers Les headers de la réponse où ajouter le cookie
 * @param cookie Le cookie à ajouter
 */
export function addCookie(
	headers: Headers,
	cookie: {
		name: string;
		value: string;
		maxAge?: number;
		secure?: boolean;
		path?: string;
	}
) {
	let val = `${cookie.name}=${cookie.value};`;
	val += cookie.maxAge ? ` Max-Age=${cookie.maxAge};` : '';
	val += cookie.secure ? ` Secure;` : '';
	val += cookie.path ? ` Path=${cookie.path};` : '';
	headers.append('Set-Cookie', val);
}

/**
 * Retourne un {@link Account} à partir d'un token de session
 * @param headers Les headers de la requête
 * @returns Le {@link Account} correspondant au token de session
 * @throws {@link SessionTokenInvalideError} Si le token de session est invalide
 * @throws {@link CaCestVraimentPasDeBolError} Si le token de session est associé à plusieurs comptes
 *
 */
async function getAccountBySession(headers: Headers): Promise<Account> {
	const cookies = headers.get('cookie');
	if (cookies) {
		const token = (cookies.endsWith(';') ? cookies : cookies + ';').match(
			/token=([^;]*);/
		); // Recuperer le token de session
		if (token.length > 0) return Account.getBySession(token[1]);
	}
	throw new SessionTokenInvalideError();
}

/**
 * Retourne un {@link Buyer} à partir d'un token de session
 * @param headers Les headers de la requête
 * @returns Le {@link Buyer} correspondant au token de session
 * @throws {@link SessionTokenInvalideError} Si le token de session est invalide
 * @throws {@link CaCestVraimentPasDeBolError} Si le token de session est associé à plusieurs comptes
 * @throws {@link AccountTypeMismatch} Si le compte associé au token de session n'est pas un {@link Buyer}
 */
export async function getBuyerBySession(headers: Headers): Promise<Buyer> {
	const account = await getAccountBySession(headers);
	return Buyer.getFromAccount(account);
}

/**
 * Retourne un {@link Company} à partir d'un token de session
 * @param headers Les headers de la requête
 * @returns Le {@link Company} correspondant au token de session
 * @throws {@link SessionTokenInvalideError} Si le token de session est invalide
 * @throws {@link CaCestVraimentPasDeBolError} Si le token de session est associé à plusieurs comptes
 * @throws {@link AccountTypeMismatch} Si le compte associé au token de session n'est pas un {@link Company}
 */
export async function getCompanyBySession(headers: Headers): Promise<Company> {
	const account = await getAccountBySession(headers);
	return Company.getFromAccount(account);
}
/**
 * Upload les images d'un article dans ./public/images/articles/uploaded avec un nom unique
 * @param files Les {@link File} du formulaire d'upload
 * @returns Un {@link Map} contenant le nom du fichier et son chemin par rapport à /public
 */
export async function uploadImages(
	files: File[]
): Promise<Map<string, { absolute: string; relative: string }>> {
	const upload_dir = path.join(path.resolve(), '/public/img/article/uploaded');
	if (fs.existsSync(upload_dir)) {
		await fs.promises.mkdir(upload_dir, { recursive: true });
	}

	const paths: Map<string, { absolute: string; relative: string }> = new Map();
	for (const file of files) {
		const ext = path.extname(file.name);
		const name = uuidv4() + ext;
		paths.set(file.name, {
			absolute: path.join(upload_dir, name),
			relative: path.join('/img/article/uploaded', name),
		});
	}

	let err: string = await Promise.all(
		files.map((file) => uploadImage(file, paths.get(file.name).absolute))
	)
		.then(() => '')
		.catch((err) => {
			return err;
		});
	if (err) {
		// Suppression des images uploadées
		await Promise.all(
			Array.from(paths.values()).map((path) =>
				fs.promises.unlink(path.absolute).catch((err) => null)
			)
		);
		throw new UploadError(err);
	}
	return paths;
}

/**
 * Upload une image dans un dossier
 * @param file Le {@link File} à uploader
 * @param path Le chemin du dossier où uploader l'image
 * @returns Un {@link Promise} résolu quand l'upload est terminé
 */
function uploadImage(file: File, path: string) {
	return new Promise((resolve, reject) => {
		stream.pipeline(
			Readable.fromWeb(file.stream() as any),
			fs.createWriteStream(path),
			(err) => {
				if (err) {
					console.error('[FILE_UPLOAD_STREAM_ERROR] : ' + err);
					reject(file.name);
				} else {
					resolve(0);
				}
			}
		);
	});
}

export class EtatInnatenduError extends Error {
	constructor(description: string) {
		super(`[Etat innatendu] ${description}`);
	}
}

export class UploadError extends Error {
	constructor(file: string) {
		super(`Erreur lors de l'upload de ${file}`);
	}
}
