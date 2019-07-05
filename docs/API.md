# API of RippleFingate

```javascript
/**
 * instance of RippleAPI
 *
 * @private
 * @memberof RippleFingate
 */
private _remote;

/**
 * create ripple wallet
 *
 * @static
 * @returns {IWallet}
 * @memberof RippleFingate
 */
static createWallet(): IWallet;

/**
 * check ripple address is valid or not
 *
 * @static
 * @param {string} address
 * @returns {boolean} return true if valid
 * @memberof RippleFingate
 */
static isValidAddress(address: string): boolean;

/**
 * check ripple secret is valid or not
 *
 * @static
 * @param {string} secret
 * @returns {boolean} return true if valid
 * @memberof RippleFingate
 */
static isValidSecret(secret: string): boolean;

/**
 * retrive address with secret
 *
 * @static
 * @param {string} secret
 * @returns {(string | null)} return address if valid, otherwise return null
 * @memberof RippleFingate
 */
static getAddress(secret: string): string | null;

readonly remote: RippleAPI;
/**
 * connect to ripple node server
 *
 * @returns
 * @memberof RippleFingate
 */
connect(): Promise<unknown>;

/**
 * check if connected to ripple node server
 *
 * @returns {boolean}
 * @memberof RippleFingate return true if connected
 */
isConnected(): boolean;

/**
 * disconnect from ripple node server
 *
 * @memberof RippleFingate
 */
disconnect(): void;

/**
 * get xrp balance
 *
 * @param {string} address
 * @returns {Promise<string>}
 * @memberof RippleFingate
 */
getXrpBalance(address: string): Promise<string>;

/**
 * sign transaction
 *
 * @param {string} txJSON
 * @param {string} secret
 * @returns {ISignature}
 * @memberof RippleFingate
 */
sign(txJSON: string, secret: string): ISignature;

/**
 * prepare payment
 *
 * @param {string} address
 * @param {IPayment} payment
 * @returns {Promise<IPrepared>}
 * @memberof RippleFingate
 */
preparePayment(address: string, payment: IPayment): Promise<IPrepared>;

/**
 * submit transaction
 *
 * @param {string} signedTransaction
 * @returns {Promise<any>}
 * @memberof RippleFingate
 */
submit(signedTransaction: string): Promise<any>;

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
formatPayment(from: string, destination: string, amount: string, memo: string): IPayment;

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
transfer(secret: string, destination: string, amount: string, memo: IMemo): Promise<string>;

```
