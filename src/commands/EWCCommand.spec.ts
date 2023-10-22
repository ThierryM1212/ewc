import { CommandOutput, printOutput, getDefaultOutput, getPrintTable } from './EWCCommand';
import JSONBigInt from 'json-bigint';


test('Test EWCCommand 0', async () => {
    const output: CommandOutput = getDefaultOutput();
    expect(output.messages).toEqual([]);
});

test('Test EWCCommand 1', async () => {
    const logSpy = jest.spyOn(console, 'log');
    const output: CommandOutput = {
        error: false,
        messages: ["test", { test: "test" }]
    };
    printOutput(output);
    expect(logSpy).toHaveBeenCalledWith("test");
    expect(logSpy).toHaveBeenCalledWith(JSONBigInt.stringify({ test: "test" }, null, 2));
});

test('Test EWCCommand 2', async () => {
    const logSpy = jest.spyOn(console, 'error');
    const output: CommandOutput = {
        error: true,
        messages: ["test", { test: "test" }]
    };
    printOutput(output);
    expect(logSpy).toHaveBeenCalledWith("test");
    expect(logSpy).toHaveBeenCalledWith(JSONBigInt.stringify({ test: "test" }, null, 2));
});

test('Test EWCCommand 3', async () => {
    process.stdout.columns = 80
    let msg = { testLab: "testVal" };
    let out = getPrintTable(msg);
    //console.log(out.split("\n")[1].split(""))
    expect(out.split("\n")[1].includes(" testLab ")).toBe(true);
    expect(out.split("\n")[1].includes(" testVal ")).toBe(true);
});

test('Test EWCCommand 4', async () => {
    process.stdout.columns = 80
    let msg = { testLab: ['l1', 'l2'] };
    let out = getPrintTable(msg);
    expect(out.split("\n")[1].includes(" testLab ")).toBe(true);
    expect(out.split("\n")[2].includes(" \"l1\", ")).toBe(true);
    expect(out.split("\n")[3].includes(" \"l2\" ")).toBe(true);
});

test('Test EWCCommand 5', async () => {
    const logSpy = jest.spyOn(console, 'log');
    process.stdout.columns = 80
    const output: CommandOutput = {
        error: false,
        messages: [{ test0: "test1" }]
    };
    printOutput(output, true);
    expect(logSpy.mockReturnValue()).toHaveBeenCalledTimes(1);
});

test('Test EWCCommand 6', async () => {
    const logSpy = jest.spyOn(console, 'log');
    process.stdout.columns = 80
    const output: CommandOutput = {
        error: false,
        messages: [{ registerValue: ["str1", "str2"] }]
    };
    printOutput(output, false);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("[\\\"str1\\\",\\\"str2\\\"]"));
});
