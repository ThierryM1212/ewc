import { Wallet, loadWallet } from "../ewc/Wallet";
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { confirm, password } from "@inquirer/prompts";



export type WalletMintOptions = {
    name: string,
    amount: number,
    decimals: number,
    description: string,
    sign: boolean,
    send: boolean,
    skipConfirm: boolean,
}

export async function walletMintCommand(walletName: string, walletPassword: string | undefined, options: WalletMintOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    const wal: Wallet | undefined = loadWallet(walletName);
    if (wal) {
        // prompt password if required
        if (!walletPassword && (options.sign || options.send)) {
            walletPassword = await password({ message: 'Enter the spending password of the wallet ' + walletName });
        }

        return { error: true, messages: ["NOT IMPLEMENTED YET"] }

    } else {
        return { error: true, messages: ["Failed to load the wallet " + walletName] }
    }
}