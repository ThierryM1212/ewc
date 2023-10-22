import JSONBigInt from 'json-bigint';

export async function post(url, body = {}, apiKey = '') {
    try {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'mode': 'cors',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
                api_key: apiKey,
            },
            body: JSONBigInt.stringify(body),
        });
        const resText = await result.text();
        const resJson = JSONBigInt.parse(resText);
        return resJson;
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function get(url, apiKey = '') {
    try {
        const result = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                api_key: apiKey,
            }
        })
        const resText = await result.text();
        const resJson = JSONBigInt.parse(resText);
        return resJson;
    } catch (e) {
        console.error(e);
        return {};
    }
}
