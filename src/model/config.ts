import { config } from 'dotenv';
config();

function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not defined, please check your .env file.`);
    }
    return value;
}

type ConfigType = {
    tmdb: {
        apiKey: string;
        baseUrl: string;
    };
};

export default class Config {
    private static _instance: Config;
    private _config: ConfigType;

    constructor() {
        this._config = {
            tmdb: {
                apiKey: getEnv('TMDB_API_KEY'),
                baseUrl: getEnv('TMDB_BASE_URL'),
            },
        };   
    }

    public static get(): ConfigType {
        if (!Config._instance) {
            Config._instance = new Config();
        }
        return Config._instance._config;
    }
}