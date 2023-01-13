import { APIRoute } from 'astro';
import Article from '../../../model/Article';
import Bids from '../../../model/Bids';

export const get: APIRoute = async ({ request }) => {
	// Get URL query parameters
	const url = new URL(request.url);
	const query: { [k: string]: any } = Object.fromEntries(url.searchParams);

	query.id = parseInt(query.id);
	if (typeof query.id !== 'number' || isNaN(query.id)) {
		return new Response('Missing search query', {
			status: 400,
		});
	}

	const article: Article = await Article.get(query.id).catch(() => null);
	if (!article) {
		return new Response('Article not found', {
			status: 404,
		});
	}
	const max_bid = await Bids.getEnchereMax(article);

	return new Response(JSON.stringify({ max_bid }), {
		headers: {
			'content-type': 'application/json',
		},
		status: 200,
	});
};
