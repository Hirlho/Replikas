import Config from "./config.js";

type TMDBMovie = {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: any;
    budget: number;
    genres: { id: number; name: string }[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: {
      id: number;
      logo_path: string | null;
      name: string;
      origin_country: string;
    }[];
    production_countries: { iso_3166_1: string; name: string }[];
    release_date: string;
    revenue: number;
    runtime: number | null;
    spoken_languages: { iso_639_1: string; name: string }[];
    status: string;
    tagline: string;
    title: string | null;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export default class TMDB {
    private static _apiKey: string = Config.get().tmdb.apiKey;
    private static _baseUrl: string = Config.get().tmdb.baseUrl;

    constructor() {
        throw new Error('This class is not meant to be instantiated.');
    }

    public static async getMovie(id: number): Promise<TMDBMovie> {
        const response = await fetch(`${this._baseUrl}/movie/${id}?api_key=${this._apiKey}`);
        const data = await response.json();
        return data;
    }
}