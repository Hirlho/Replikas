import Config from "./config";

export default class TMDB {
    private static _apiKey: string = Config.get().tmdb.apiKey;
    private static _baseUrl: string = Config.get().tmdb.baseUrl;

    constructor() {
        throw new Error('This class is not meant to be instantiated.');
    }
}