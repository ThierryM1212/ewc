import JSONBigInt from 'json-bigint';
var Table = require('cli-table3');

export type CommandOutput = {
    error: boolean,
    messages: Array<any>
}

export function getDefaultOutput(): CommandOutput {
    return { error: false, messages: [] };
}

export function printOutput(output: CommandOutput, text: boolean = false) {
    for (let m of output.messages) {
        if (typeof m === 'string') {
            if (output.error) {
                console.error(m)
            } else {
                console.log(m)
            }
        } else {
            if (output.error) {
                console.error(JSONBigInt.stringify(m, null, 2))
            } else {
                if (text) {
                    let tableTxt = getPrintTable(m);
                    console.log(tableTxt);
                } else {
                    if (m.registerValue) {
                        console.log(JSONBigInt.stringify(m, function(k,v){
                            if(v instanceof Array)
                               return JSON.stringify(v);
                            return v;
                         }, 2))
                    } else {
                        console.log(JSONBigInt.stringify(m, null, 2))
                    }
                }
            }
        }
    }
}

function getMaxRowWidth(str: string): number {
    let lines = str.split(/\r?\n/);
    let rowSizes = lines.map(l => l.length)
    return Math.max(...rowSizes);
}

export function getPrintTable(m: any): string {
    // compute table size and build the printable table
    let totalWidth = process.stdout.columns, margin = 10;
    let maxKeySize = 0, maxRowSize = 0, res = [];
    for (let k of Object.keys(m)) {
        let t: any = {}
        if (typeof m[k] === 'string') {
            maxKeySize = Math.max(maxKeySize, k.length)
            maxRowSize = Math.max(maxRowSize, m[k].length)
            t[k] = [m[k]];
        } else {
            maxKeySize = Math.max(maxKeySize, k.length) 
            if (Array.isArray(m[k]) && m[k].length > 0 && typeof m[k][0] !== 'string') {
                maxRowSize = Math.max(maxRowSize, getMaxRowWidth(JSONBigInt.stringify(m[k])))
                t[k] = [JSONBigInt.stringify(m[k])];
            } else {
                maxRowSize = Math.max(maxRowSize, getMaxRowWidth(JSONBigInt.stringify(m[k], null, 2)))
                t[k] = [JSONBigInt.stringify(m[k], null, 2)];
            }
        }
        res.push(t);
    }

    let col1Size = 2 + maxKeySize;
    let col2Size: number | null = totalWidth - 2 - col1Size - margin; // max size
    if (col2Size > maxRowSize) {
        col2Size = maxRowSize + 4;
    }
    let table = new Table(
        {
            wordWrap: true,
            wrapOnWordBoundary: false,
            colWidths: [col1Size, col2Size],
        });

    for (let t of res) {
        table.push(t)
    }
    return table.toString();
}