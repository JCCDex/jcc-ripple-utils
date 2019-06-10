import BigNumber from "bignumber.js";
import * as rippleWallet from "jcc_wallet/lib/ripple";
import { RippleAPI } from "ripple-lib";
import IWallet from "./model/wallet";
import IMemo from "./model/memo";
import IPayment from "./model/payment";
import { isValidRippleSecret, isValidRippleAddress, isValidAmount, isValidMemo, validate } from "./validator";
import IPrepared from "./model/prepared";
import ISignature from "./model/signature";

export default class RippleFingate {

    private _remote = null;

    constructor(node: string) {
        this._remote = new RippleAPI({
            server: node
        });
    }

    public static createWallet(): IWallet {
        return rippleWallet.createWallet();
    }

    public static isValidAddress(address: string): boolean {
        return rippleWallet.isValidAddress(address);
    }

    public static isValidSecret(secret: string): boolean {
        return rippleWallet.isValidSecret(secret);
    }

    public static getAddress(secret: string): string | null {
        return rippleWallet.getAddress(secret);
    }

    public get remote(): RippleAPI {
        return this._remote;
    }

    public async connect() {
        return new Promise((resolve, reject) => {
            this._remote.connect().then(() => {
                return resolve();
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    public isConnected(): boolean {
        return this._remote.isConnected();
    }

    public disconnect() {
        if (this._remote) {
            this._remote.disconnect();
        }
    }

    public async getXrpBalance(address: string): Promise<string> {
        try {
            const balances = await this._remote.getBalances(address);
            const balance = balances.find(b => b.currency.toUpperCase() === "XRP");
            return balance.value;
        } catch (error) {
            throw error;
        }
    }

    public sign(txJSON: string, secret: string): ISignature {
        try {
            return this._remote.sign(txJSON, secret);
        } catch (error) {
            throw error;
        }
    }

    public preparePayment(address: string, payment: IPayment): Promise<IPrepared> {
        return new Promise((resolve, reject) => {
            this._remote.preparePayment(address, payment).then(prepared => {
                return resolve(prepared);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    public submit(signedTransaction: string) {
        return new Promise((resolve, reject) => {
            this._remote.submit(signedTransaction).then(result => {
                return resolve(result);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    public formatPayment(from: string, destination: string, amount: number, memo: string): IPayment {
        const payment: IPayment = {
            source: {
                address: from,
                maxAmount: {
                    value: new BigNumber(amount).toString(10),
                    currency: "XRP"
                }
            },
            destination: {
                address: destination,
                amount: {
                    value: new BigNumber(amount).toString(10),
                    currency: "XRP"
                }
            },
            memos: [{
                type: "payment",
                format: "plain/text",
                data: memo
            }]
        }
        return payment;
    }

    @validate
    public async transfer(@isValidRippleSecret secret: string, @isValidRippleAddress destination: string, @isValidAmount amount: number, @isValidMemo memo: IMemo): Promise<string> {
        const from = RippleFingate.getAddress(secret);
        const payment = this.formatPayment(from, destination, amount, JSON.stringify(memo));
        try {
            const prepared = await this.preparePayment(from, payment);
            const signature = await this.sign(prepared.txJSON, secret);
            const response: any = await this.submit(signature.signedTransaction);
            if (response.resultCode === 'tesSUCCESS') {
                return signature.id;
            } else {
                throw new Error(response.resultMessage);
            }
        } catch (error) {
            throw error;
        }
    }
}
