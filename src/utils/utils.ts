import { NANOERG_TO_ERG } from "./constants";

export function range(start: number, end: number, interval = 0): Array<number> {
    let arr = [];
    interval = interval > 0 ? interval - 1 : 0
    for (let i = start; i < end; i++) {
        arr.push(i)
        i += interval;
    }
    return arr
}

export function formatERGAmount(amount: bigint): string {
    return (parseInt(amount.toString()) / NANOERG_TO_ERG).toFixed(4);
}

export function formatTokenAmount(amount: bigint, decimals: number, trimTrailing0 = true): string {
    if (decimals > 0) {
        var str: Array<string> = [];
        //console.log("formatTokenAmount", amountInt, decimalsInt);
        const amountStr = amount.toString();
        if (amountStr.length > decimals) {
            //console.log("formatTokenAmount2",amountStr.slice(0, Math.abs(decimalsInt - amountStr.length)), amountStr.slice(amountStr.length - decimalsInt))
            str = [amountStr.substring(0, amountStr.length - decimals), amountStr.substring(amountStr.length - decimals)]
        } else {
            str = ['0', '0'.repeat(decimals - amountStr.length) + amountStr]
        }

        //console.log("formatTokenAmount3", str);

        //const numberAmount = (BigInt(amountInt) / BigInt(Math.pow(10, parseInt(decimalsInt)))).toFixed(parseInt(decimalsInt));
        //const strAmount = amountInt.toString();
        //const numberAmount = strAmount.substring(0, parseInt(decimalsInt)-1) + "." + strAmount.substring(parseInt(decimalsInt)-1);
        //var str = numberAmount.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (trimTrailing0) { str[1] = str[1].replace(/0+$/g, "") };
        if (str[1].length > 0) {
            return str.join(".");
        } else {
            return str[0]
        }

    } else {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

