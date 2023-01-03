import TMDB from "../src/model/tmdb";

test("TMDB API works fine", async () => {
	const data = await TMDB.getMovie(550);
	expect(data).toHaveProperty("original_title", "Fight Club"); // Check if the movie is Fight Club

	const posterURL = await TMDB.getMoviePosterURL(550);
	expect(posterURL).toBe(
		"https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
	);
});
