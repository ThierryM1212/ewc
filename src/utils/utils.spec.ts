import { range, formatERGAmount, formatTokenAmount } from "./utils";


test('utils - 0', async () => {
    const ref = range(1, 100, 20);
    expect(ref).toEqual([1, 21, 41, 61, 81]);
    const ref2 = range(1, 5, 0);
    expect(ref2).toEqual([1,2,3,4]);

    const formatedErg = formatERGAmount(BigInt(10050000000));
    expect(formatedErg).toBe("10.0500");

    const formatedTokenAmount = formatTokenAmount(BigInt(1005000), 4);
    expect(formatedTokenAmount).toBe("100.5");

    const formatedTokenAmount2 = formatTokenAmount(BigInt(1005000), 9);
    expect(formatedTokenAmount2).toBe("0.001005");

    const formatedTokenAmount3 = formatTokenAmount(BigInt(1005000), 0);
    expect(formatedTokenAmount3).toBe("1,005,000");

    const formatedTokenAmount4 = formatTokenAmount(BigInt(100500), 2);
    expect(formatedTokenAmount4).toBe("1,005");

})


