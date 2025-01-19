import { BalanceInfo, BalanceH, TokenH, getBalanceInfo } from "./BalanceInfo";
import { Network, NewToken } from '@fleet-sdk/common';
import JSONBigInt from 'json-bigint';


describe('Test BalanceInfo - 0', () => {

  test('BalanceInfo - 0', async () => {
    let et0: NewToken<bigint> = { "amount": BigInt(100), tokenId: 'testTokenId0', decimals: 0, name: 'testToken0' };

    expect(et0.tokenId).toBe('testTokenId0');
    expect(et0.amount).toBe(BigInt(100));
    et0.amount += BigInt(100);
    expect(et0.amount).toBe(BigInt(200));
    et0.tokenId = "newTokenId";
    expect(et0.tokenId).toBe('newTokenId');
  })

  test('BalanceInfo - 0', async () => {
    let et0: NewToken<bigint> = { "amount": BigInt(100), tokenId: 'testTokenId0', decimals: 0, name: 'testToken0' };
    let et1: NewToken<bigint> = { "amount": BigInt(101), tokenId: 'testTokenId1', decimals: 0, name: 'testToken1' };
    const eb0 = new BalanceInfo(BigInt(1000000000), [et0, et1], true);

    expect(eb0.nanoERG).toBe(BigInt(1000000000));
    expect(eb0.tokens).toEqual([et0, et1]);
    expect(eb0.confirmed).toBe(true);
    eb0.nanoERG = BigInt(1000);
    expect(eb0.nanoERG).toBe(BigInt(1000));
    eb0.tokens = [et0];
    expect(eb0.tokens).toEqual([et0]);
    eb0.confirmed = false;
    expect(eb0.confirmed).toBe(false);
  })

  test('BalanceInfo - 1', async () => {
    let et0: NewToken<bigint> = { "amount": BigInt(100), tokenId: 'testTokenId0', decimals: 0, name: 'testToken0' };
    let et1: NewToken<bigint> = { "amount": BigInt(101), tokenId: 'testTokenId1', decimals: 0, name: 'testToken1' };
    let et2: NewToken<bigint> = { "amount": BigInt(10), tokenId: 'testTokenId0', decimals: 0, name: 'testToken0' };
    let et3: NewToken<bigint> = { "amount": BigInt(15), tokenId: 'newId', decimals: 0, name: 'new' };
    let et4: NewToken<bigint> = { "amount": BigInt(15), decimals: 0, name: 'new' };
    const eb0 = new BalanceInfo(BigInt(1000000000), [et0, et1], true);
    const eb1 = new BalanceInfo(BigInt(100000), [et2, et3], true);
    const eb2 = new BalanceInfo(BigInt(100000), [et2, et3, et4], true);
    eb0.add(eb1);
    expect(eb0.nanoERG).toBe(BigInt(1000100000));

    expect(eb0.getToken('testTokenId0')?.amount).toBe(BigInt(110));
    expect(eb0.getToken('newId')?.amount).toBe(BigInt(15));

    expect(eb0.getToken('not_exists_token_id')?.amount).toBeUndefined();

    expect(eb2.getTokenIdList()).toEqual(['testTokenId0', 'newId', ""]);

    expect(eb0.getSelectionTarget()).toEqual({ "nanoErgs": 1001200000n, "tokens": [{ "amount": 110n, "tokenId": "testTokenId0" }, { "amount": 101n, "tokenId": "testTokenId1" }, { "amount": 15n, "tokenId": "newId" }] });
    expect(eb2.getSelectionTarget()).toEqual({ "nanoErgs": 1200000n, "tokens": [{ "amount": 10n, "tokenId": "testTokenId0" }, { "amount": 15n, "tokenId": "newId" }] });

  })

  test('BalanceInfo - 2', async () => {
    let t0: TokenH = {
      tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
      amount: "123"
    }
    let bh0: BalanceH = {
      amountERG: "0.1",
      tokens: [t0]
    }
    let b0 = await getBalanceInfo(bh0, Network.Testnet);

    expect(b0?.nanoERG).toBe(BigInt(100000000));
    expect(b0?.tokens[0].amount).toBe(BigInt(12300));
    expect(b0?.tokens[0].tokenId).toBe("ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7");

  })

  test('BalanceInfo - 3', async () => {
    let t0: TokenH = {
      tokenId: "bad7034",
      amount: "123"
    }
    let bh0: BalanceH = {
      amountERG: "0.1",
      tokens: [t0]
    }
    let b0 = await getBalanceInfo(bh0, Network.Testnet);
    expect(b0).toBeUndefined();

  })

  test('BalanceInfo - 4', async () => {
    let et0: NewToken<bigint> = { "amount": BigInt(100), tokenId: 'testTokenId0', decimals: 0, name: 'testToken0' };
    let et1: NewToken<bigint> = { "amount": BigInt(10000), tokenId: 'testTokenId1', decimals: 3, name: 'testToken1' };
    let et2: NewToken<bigint> = { "amount": BigInt(10000) };
    const eb0 = new BalanceInfo(BigInt(1000000000), [et0, et1, et2], true);
    let bh0 = eb0.getBalanceH();
    expect(bh0).toEqual({
      "amountERG": "1.0000",
      "tokens": [
        { "amount": "100", "tokenId": "testTokenId0", },
        { "amount": "10", "tokenId": "testTokenId1", },
        { "amount": "10,000", "tokenId": "", },
      ],
    });
  })

});

