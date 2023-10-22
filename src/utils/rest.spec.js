import { get, post } from "./rest";


test('rest - 0', async () => {
    const res = await get('http://bad___url.com')
    //console.log(res)
    expect(res).toEqual({})

    const res2 = await post('http://bad___url.com', {dummy: ""})
    //console.log(res)
    expect(res).toEqual({})
})
