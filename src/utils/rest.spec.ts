import { get, post, DEFAULT_HEADERS, RequestOptions } from "./rest";


const mockResponseText = (data: string) => {
    return { text: () => new Promise((resolve) => resolve(data)) } as unknown as Response;
};
const fetchMock = () => Promise.resolve(mockResponseText('{"test": 0}'));

test('rest - get', async () => {
    let nodeOptions: RequestOptions = {
        url: "https://sample.url.com",
        parser: JSON,
        fetcher: fetchMock,
        headers: DEFAULT_HEADERS,
    }
    let res = await get(nodeOptions);
    expect(res).toEqual({ test: 0 })

    global.fetch = fetchMock;
    nodeOptions = {
        url: "https://sample.url.com",
    }
    res = await get(nodeOptions);
    expect(res).toEqual({ test: 0 })
})

test('rest - post', async () => {
    global.fetch = fetchMock;
    let nodeOptions: RequestOptions = {
        url: "https://sample.url.com",
    }
    let res = await post({}, nodeOptions);
    expect(res).toEqual({ test: 0 })
})

