import { APIRoute } from 'astro';
import Buyer from '../../model/users/Buyer';
import { getAccountBySession } from '../../model/Utilitaire';

export const post: APIRoute = async ({ request }) => {
	// Get the json body
	const query = await request.json();

	query.id = parseInt(query.id);
	if (!(query.id && typeof query.liked === 'boolean')) {
		return new Response('Missing parameters (id, liked)', {
			status: 400,
		});
	}

	let buyer: Buyer;
	try {
		buyer = await Buyer.getFromAccount(
			await getAccountBySession(request.headers)
		);
		if (query.liked) {
			await buyer.likeArticle(query.id);
		} else {
			await buyer.unlikeArticle(query.id);
		}
	} catch (e) {
		return new Response(e.constructor.name + ' : ' + e.message, {
			status: 401,
		});
	}

	return new Response('success', {
		status: 200,
	});
};
