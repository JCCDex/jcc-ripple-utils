import RippleFingate from "../rippleFingate";
import { isValidAddress } from "jcc_wallet/lib/jingtum";

const router = Symbol();
const checkRippleAddressKey = Symbol();
const checkMemoKey = Symbol();
const checkRippleSecretKey = Symbol();
const checkAmountKey = Symbol();

const setTarget = (target: any, name: string, index: number, key: symbol) => {
    target[router] = target[router] || {};
    target[router][name] = target[router][name] || {};
    target[router][name].params = target[router][name].params || [];
    target[router][name].params[index] = key;
};

export const isValidRippleAddress = (target: any, name: string, index: number) => {
    setTarget(target, name, index, checkRippleAddressKey);
};

export const isValidRippleSecret = (target: any, name: string, index: number) => {
    setTarget(target, name, index, checkRippleSecretKey);
};

export const isValidMemo = (target: any, name: string, index: number) => {
    setTarget(target, name, index, checkMemoKey);
};

export const isValidAmount = (target: any, name: string, index: number) => {
    setTarget(target, name, index, checkAmountKey);
};

export const validate = (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function () {
        const params = target[router][name].params;
        /* istanbul ignore else */
        if (Array.isArray(params)) {
            const length = params.length;
            for (let index = 0; index < length; index++) {
                const element = params[index];
                const value = arguments[index];
                switch (element) {
                    case checkRippleAddressKey:
                        if (!RippleFingate.isValidAddress(value)) {
                            throw new Error(`${value} is invalid ripple address.`);
                        }
                        break;
                    case checkRippleSecretKey:
                        if (!RippleFingate.isValidSecret(value)) {
                            throw new Error(`${value} is invalid ripple secret.`);
                        }
                        break;
                    case checkAmountKey:
                        if (Number.isNaN(value) || !Number.isFinite(value) || value <= 0) {
                            throw new Error(`${value} is invalid amount.`);
                        }
                        break;
                    case checkMemoKey:
                        if (!isValidAddress(value.jtaddress)) {
                            throw new Error(`${value.jtaddress} is invalid jingtum address in memo.`);
                        }
                        break;
                    /* istanbul ignore next */
                    default:
                        break;
                }
            }
        }
        return method.apply(this, arguments);
    };
};
