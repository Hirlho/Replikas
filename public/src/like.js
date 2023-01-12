function updateColor(element) {
	const liked = element.getAttribute('data-liked') === 'true';
	element.classList.add(liked ? 'filter-crimson' : 'filter-whitesmoke');
	element.classList.remove(liked ? 'filter-whitesmoke' : 'filter-crimson');
}

async function likeArticle(element, event) {
	event.preventDefault();
	event.stopPropagation();
	const img = element;
	const id = img.getAttribute('data-id');
	const liked = img.getAttribute('data-liked') === 'true';
	const url = '/api/like';
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
			liked: !liked,
		}),
	})
		.then((res) => {
			if (res.status === 200) {
				img.setAttribute('data-liked', '' + !liked);
				updateColor(img);
			}
		})
		.catch((err) => {
			console.error(err);
		});
}
