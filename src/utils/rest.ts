export type Fetcher = typeof fetch;

export const DEFAULT_HEADERS: Headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'mode': 'cors',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
});

export interface ResponseParser {
    parse(text: string): unknown;
    stringify(value: unknown): string;
}

export interface RequestOptions {
    url: URL | string;
    headers?: Headers;
    parser?: ResponseParser; // Use json-bigint for parsing Ergo boxes or transactions
    fetcher?: Fetcher;
}

export async function get(options: RequestOptions): Promise<any> {
    return _fetch('GET', options);
}

export async function post(body: any, options: RequestOptions): Promise<any> {
    return _fetch('POST', options, body);
}

type FetchType = 'GET' | 'POST';

async function _fetch(type:FetchType, options: RequestOptions, body: any = undefined) {
    if (!options.headers) {
        options.headers = DEFAULT_HEADERS;
    }
    if (!options.parser) {
        options.parser = JSON;
    }
    if (!options.fetcher) {
        options.fetcher = fetch;
    }
    let response: Response;
    if (type === 'GET') {
        response = await options.fetcher(options.url, {
            method: "GET",
            headers: options.headers,
        });
    } else {
        response = await options.fetcher(options.url, {
            method: "POST",
            headers: options.headers,
            body: options.parser.stringify(body)
        });
    }
    const data = await response.text();
    return options.parser.parse(data);
}