import { APIRoute } from 'astro';
import Article from '../../../../model/Article';
import Bids from '../../../../model/Bids';

export const get: APIRoute = async ({ params, request }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) {
		return new Response('Missing search query', {
			status: 400,
		});
	}

	const article: Article = await Article.get(id).catch(() => null);
	if (!article) {
		return new Response('Article not found', {
			status: 404,
		});
	}
	const current_bid = await Bids.getEnchereMax(article);
	const min_bid = article.getEncherissementMin();

	return new Response(JSON.stringify({ current_bid, min_bid }), {
		headers: {
			'content-type': 'application/json',
		},
		status: 200,
	});
};
