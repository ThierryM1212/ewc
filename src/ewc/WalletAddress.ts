import { Network } from "@fleet-sdk/common";
import { NodeClient } from "../ergo/node";
import { getNodeClient } from "./Config";

export class WalletAddress {
  private _pk: string;
  private _used: boolean;
  private _index: number;
  

  constructor(pk: string, index: number, used: boolean = false) {
    this._pk = pk;
    this._used = used;
    this._index = index;
  }

  public async updateAddressUsed(network: Network = Network.Mainnet): Promise<boolean> {
    const nodeClient: NodeClient = getNodeClient(network);
    const isUsed = await nodeClient.addressHasTransactions(this._pk);
    if (isUsed) {
      this.used = true;
    }
    return this.used;
  }

  public get pk(): string {
    return this._pk;
  }
  public set pk(value: string) {
    this._pk = value;
  }
  
  public get used(): boolean {
    return this._used;
  }
  public set used(value: boolean) {
    this._used = value;
  }
  
  public get index(): number {
    return this._index;
  }
  public set index(value: number) {
    this._index = value;
  }

}