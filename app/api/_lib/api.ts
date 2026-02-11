import {OpenAI} from "openai";


const client_api = () => {
    return new OpenAI({
        apiKey: 'sk-MzjA4oXhO50QsaLQQWHEGA',
        baseURL: 'https://api.artemox.ru/v1',
    });
}

export default client_api();