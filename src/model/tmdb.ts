import Config from "./config.js";

export default class TMDB {
    private static _apiKey: string = Config.get().tmdb.apiKey;
    private static _baseUrl: string = Config.get().tmdb.baseUrl;

    constructor() {
        throw new Error('This class is not meant to be instantiated.');
    }

    public static async getMovie(id: number): Promise<any> {
        const response = await fetch(`${this._baseUrl}/movie/${id}?api_key=${this._apiKey}`);
        const data = await response.json();
        return data;
    }
}