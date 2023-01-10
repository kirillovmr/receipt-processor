import {
    Item,
    Receipt,
    ValidateResult,
} from "./types"

/**
 * Base validator class that shares common functions and validate() method
 */
export abstract class Validator {
    /**
     * An array of functions (defined by subclasses)
     *  to be used in validation pipeline
     */
    protected static pipes: ((input: any) => ValidateResult)[]

    /**
     * Check whether input is a valid object
     */
    protected static _isObject(input: any) {
        const valid = (
            input
            && typeof input === 'object'
            && !Array.isArray(input)
        )
        return { valid, error: `not an object` }
    }

    /**
     * Check whether input is a valid array
     */
    protected static _isArray(input: any) {
        const valid = (
            input
            && typeof input === 'object'
            && Array.isArray(input)
        )
        return { valid, error: `not an array` }
    }

    /**
     * Check whether input is a valid string
     */
    protected static __isString(value: any): boolean {
        return value && typeof value === 'string'
    }

    /**
     * Check whether input is a valid date string in format "yyyy-mm-dd"
     */
    protected static __isValidDateString(value: any): boolean {
        const date = new Date(value)
        return (
            this.__isString(value)
            && /^\d{4}-\d{2}-\d{2}$/.test(value)
            && date instanceof Date
            && !isNaN(date.getTime())
        )
    }

    /**
     * Check whether input is a valid time string in format "hh-mm"
     */
    protected static __isValidTimeString(value: any): boolean {
        return (
            this.__isString(value)
            && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
        )
    }

    /**
     * Check whether input is a valid price string in format "^\\d+\\.\\d{2}$"
     */
    protected static __isValidPriceString(value: any): boolean {
        return (
            this.__isString(value)
            && /^\d+\.\d{2}$/.test(value)
        )
    }

    /**
     * Performs a pipelined validation
     */
    public static validate(input: any): ValidateResult {
        let pipeRes
        for (const pipe of this.pipes) {
            pipeRes = pipe(input)
            if (!pipeRes.valid) {
                return pipeRes
            }
        }
        return pipeRes
    }
}


/**
 * Item type validator
 */
export abstract class ItemValidator extends Validator {
    protected static pipes = [
        Validator._isObject,
        ItemValidator._validateShortDescription,
        ItemValidator._validatePrice,
    ]

    private static _validateShortDescription(i: Item): ValidateResult {
        const valid = Validator.__isString(i.shortDescription)
        return { valid, error: `property 'shortDescription' is wrong or missing` }
    }

    private static _validatePrice(i: Item): ValidateResult {
        const valid = Validator.__isValidPriceString(i.price)
        return { valid, error: `property 'price' is wrong or missing` }
    }
}


/**
 * Receipt type validator
 */
export abstract class ReceiptValidator extends Validator {
    protected static pipes = [
        Validator._isObject,
        ReceiptValidator._validateRetailer,
        ReceiptValidator._validatePurchaseDate,
        ReceiptValidator._validatePurchaseTime,
        ReceiptValidator._validateTotal,
        ReceiptValidator._validateItems,
    ]

    private static _validateRetailer(r: Receipt): ValidateResult {
        const valid = Validator.__isString(r.retailer)
        return { valid, error: `property 'retailer' is wrong or missing` }
    }

    private static _validatePurchaseDate(r: Receipt): ValidateResult {
        const valid = Validator.__isValidDateString(r.purchaseDate)
        return { valid, error: `property 'purchaseDate' is wrong or missing` }
    }

    private static _validatePurchaseTime(r: Receipt): ValidateResult {
        const valid = Validator.__isValidTimeString(r.purchaseTime)
        return { valid, error: `property 'purchaseTime' is wrong or missing` }
    }

    private static _validateTotal(r: Receipt): ValidateResult {
        const valid = Validator.__isValidPriceString(r.total)
        return { valid, error: `property 'total' is wrong or missing` }
    }

    private static _validateItems(r: Receipt): ValidateResult {
        const isArrayRes = Validator._isArray(r.items)
        if (!isArrayRes.valid)
            return { valid: false, error: `property 'items': ${isArrayRes.error}` }

        if (r.items.length === 0)
            return { valid: false, error: `property 'items': can not be empty` }

        let itemRes
        for (let i = 0; i < r.items.length; i++) {
            itemRes = ItemValidator.validate(r.items[i])
            if (!itemRes.valid) {
                return { valid: false, error: `property 'items' [${i}]: ${itemRes.error}` }
            }
        }

        return itemRes
    }
}