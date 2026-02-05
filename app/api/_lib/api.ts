import {OpenAI} from "openai";


export const client_api = () => {
    return new OpenAI({
        apiKey: 'sk-MzjA4oXhO50QsaLQQWHEGA',
        baseURL: 'https://api.artemox.ru/v1',
    });
}