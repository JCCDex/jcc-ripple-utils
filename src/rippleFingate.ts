import BigNumber from "bignumber.js";
import * as rippleWallet from "jcc_wallet/lib/ripple";
import { RippleAPI } from "ripple-lib";
import IMemo from "./model/memo";
import IPayment from "./model/payment";
import IPrepared from "./model/prepared";
import ISignature from "./model/signature";
import IWallet from "./model/wallet";
import { isValidAmount, isValidMemo, isValidRippleAddress, isValidRippleSecret, validate } from "./validator";

/**
 * ripple fingate
 *
 * @export
 * @class RippleFingate
 */
export default class RippleFingate {

    /**
     * instance of RippleAPI
     *
     * @private
     * @memberof RippleFingate
     */
    private _remote = null;

    /**
     * Creates an instance of RippleFingate.
     * @param {string} node
     * @memberof RippleFingate
     */
    constructor(node: string) {
        this._remote = new RippleAPI({
            server: node
        });
    }

    /**
     * create ripple wallet
     *
     * @static
     * @returns {IWallet}
     * @memberof RippleFingate
     */
    public static createWallet(): IWallet {
        return rippleWallet.createWallet({});
    }

    /**
     * check ripple address is valid or not
     *
     * @static
     * @param {string} address
     * @returns {boolean} return true if valid
     * @memberof RippleFingate
     */
    public static isValidAddress(address: string): boolean {
        return rippleWallet.isValidAddress(address);
    }

    /**
     * check ripple secret is valid or not
     *
     * @static
     * @param {string} secret
     * @returns {boolean} return true if valid
     * @memberof RippleFingate
     */
    public static isValidSecret(secret: string): boolean {
        return rippleWallet.isValidSecret(secret);
    }

    /**
     * retrive address with secret
     *
     * @static
     * @param {string} secret
     * @returns {(string | null)} return address if valid, otherwise return null
     * @memberof RippleFingate
     */
    public static getAddress(secret: string): string | null {
        return rippleWallet.getAddress(secret);
    }

    public get remote(): RippleAPI {
        return this._remote;
    }

    /**
     * connect to ripple node server
     *
     * @returns
     * @memberof RippleFingate
     */
    public async connect() {
        return new Promise((resolve, reject) => {
            this._remote.connect().then(() => {
                return resolve();
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    /**
     * check if connected to ripple node server
     *
     * @returns {boolean}
     * @memberof RippleFingate return true if connected
     */
    public isConnected(): boolean {
        return this._remote.isConnected();
    }

    /**
     * disconnect from ripple node server
     *
     * @memberof RippleFingate
     */
    public disconnect() {
        /* istanbul ignore else */
        if (this._remote) {
            this._remote.disconnect();
        }
    }

    /**
     * get xrp balance
     *
     * @param {string} address
     * @returns {Promise<string>}
     * @memberof RippleFingate
     */
    public async getXrpBalance(address: string): Promise<string> {
        try {
            const balances = await this._remote.getBalances(address);
            const balance = balances.find((b) => b.currency.toUpperCase() === "XRP");
            return balance.value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * sign transaction
     *
     * @param {string} txJSON
     * @param {string} secret
     * @returns {ISignature}
     * @memberof RippleFingate
     */
    public sign(txJSON: string, secret: string): ISignature {
        try {
            return this._remote.sign(txJSON, secret);
        } catch (error) {
            throw error;
        }
    }

    /**
     * prepare payment
     *
     * @param {string} address
     * @param {IPayment} payment
     * @returns {Promise<IPrepared>}
     * @memberof RippleFingate
     */
    public preparePayment(address: string, payment: IPayment): Promise<IPrepared> {
        return new Promise((resolve, reject) => {
            this._remote.preparePayment(address, payment).then((prepared) => {
                return resolve(prepared);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    /**
     * submit transaction
     *
     * @param {string} signedTransaction
     * @returns {Promise<any>}
     * @memberof RippleFingate
     */
    public submit(signedTransaction: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._remote.submit(signedTransaction).then((result) => {
                return resolve(result);
            }).catch((error) => {
                return reject(error);
            });
        });
    }

    /**
     * format payment data
     *
     * @param {string} from ripple address
     * @param {string} destination ripple address
     * @param {string} amount amount
     * @param {string} memo memo
     * @returns {IPayment}
     * @memberof RippleFingate
     */
    public formatPayment(from: string, destination: string, amount: string, memo: string): IPayment {
        const payment: IPayment = {
            destination: {
                address: destination,
                amount: {
                    currency: "XRP",
                    value: amount
                }
            },
            memos: [{
                data: memo,
                format: "plain/text",
                type: "payment"
            }],
            source: {
                address: from,
                maxAmount: {
                    currency: "XRP",
                    value: amount
                }
            }
        };
        return payment;
    }

    /**
     * transfer XRP
     *
     * @param {string} secret ripple secret
     * @param {string} destination ripple destination address
     * @param {string} amount transfer amount
     * @param {IMemo} memo  transfer memo
     * @returns {Promise<string>} return hash if success
     * @memberof RippleFingate
     */
    @validate
    public async transfer(@isValidRippleSecret secret: string, @isValidRippleAddress destination: string, @isValidAmount amount: string, @isValidMemo memo: IMemo): Promise<string> {
        const from = RippleFingate.getAddress(secret);
        const payment = this.formatPayment(from, destination, new BigNumber(amount).toString(10), JSON.stringify(memo));
        try {
            const prepared = await this.preparePayment(from, payment);
            const signature = await this.sign(prepared.txJSON, secret);
            const response: any = await this.submit(signature.signedTransaction);
            if (response.resultCode === "tesSUCCESS") {
                return signature.id;
            } else {
                throw new Error(response.resultMessage);
            }
        } catch (error) {
            throw error;
        }
    }
}
