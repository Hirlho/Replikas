import { APIRoute } from 'astro';
import Article from '../../model/Article';

export const get: APIRoute = async ({ request }) => {
	// Get URL query parameters
	const url = new URL(request.url);
	const query: { [k: string]: any } = Object.fromEntries(url.searchParams);

	if (!query.search) {
		return new Response('Missing search query', {
			status: 400,
		});
	}

	const matches = await Article.getBySearch(query.search, {
		limit: query.limit,
		offset: query.offset,
	});

	return new Response(JSON.stringify(matches), {
		headers: {
			'content-type': 'application/json',
		},
		status: 200,
	});
};
