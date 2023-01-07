export { dateDiff };

/**
 *
 * @param date1
 * @param date2
 * @returns {day: number, hour: number, min: number, sec: number} The difference between date1 and date2 in days, hours, minutes and seconds
 */
function dateDiff(date1: Date, date2: Date) {
	// This function calculates the time between date1 and date2

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
	cookie: { name: string; value: string; maxAge?: number; secure?: boolean; path?: string }
) {
	let val = `${cookie.name}=${cookie.value};`;
	val += cookie.maxAge ? ` Max-Age=${cookie.maxAge};` : "";
	val += cookie.secure ? ` Secure;` : "";
	val += cookie.path ? ` Path=${cookie.path};` : "";
	headers.append("Set-Cookie", val);
}
