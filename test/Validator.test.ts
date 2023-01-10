import {
    Validator,
    ReceiptValidator,
    ItemValidator,
} from '../src/Validator'

import {
    Item,
    Receipt,
} from '../src/types'


describe('Validators test', () => {

    describe('Base Validator class test', () => {
        /**
         * Make public wrappers for protected members
         */
        class PublicValidator extends Validator {
            static _isObject(input: any) {
                return Validator._isObject(input)
            }
            static _isArray(input: any) {
                return Validator._isArray(input)
            }
            static __isString(input: any) {
                return Validator.__isString(input)
            }
            static __isValidDateString(input: any) {
                return Validator.__isValidDateString(input)
            }
            static __isValidTimeString(input: any) {
                return Validator.__isValidTimeString(input)
            }
            static __isValidPriceString(input: any) {
                return Validator.__isValidPriceString(input)
            }
        }

        it('should correctly execute method _isObject', () => {
            expect(PublicValidator._isObject({}).valid).toBe(true)
            expect(PublicValidator._isObject([]).valid).toBe(false)
            expect(PublicValidator._isObject('string').valid).toBe(false)
        })

        it('should correctly execute method _isArray', () => {
            expect(PublicValidator._isArray({}).valid).toBe(false)
            expect(PublicValidator._isArray([]).valid).toBe(true)
            expect(PublicValidator._isArray('string').valid).toBe(false)
        })

        it('should correctly execute method __isString', () => {
            expect(PublicValidator.__isString({})).toBe(false)
            expect(PublicValidator.__isString([])).toBe(false)
            expect(PublicValidator.__isString('string')).toBe(true)
        })

        it('should correctly execute method __isValidDateString', () => {
            expect(PublicValidator.__isValidDateString('2022-01-13')).toBe(true)
            expect(PublicValidator.__isValidDateString('2022-13-13')).toBe(false)
            expect(PublicValidator.__isValidDateString('2022-13-130')).toBe(false)
            expect(PublicValidator.__isValidDateString('string')).toBe(false)
        })

        it('should correctly execute method __isValidTimeString', () => {
            expect(PublicValidator.__isValidTimeString('13:01')).toBe(true)
            expect(PublicValidator.__isValidTimeString('01:01')).toBe(true)
            expect(PublicValidator.__isValidTimeString('24:00')).toBe(false)
            expect(PublicValidator.__isValidTimeString('13:1')).toBe(false)
        })

        it('should correctly execute method __isValidPriceString', () => {
            expect(PublicValidator.__isValidPriceString('0.99')).toBe(true)
            expect(PublicValidator.__isValidPriceString('17.53')).toBe(true)
            expect(PublicValidator.__isValidPriceString('17.5')).toBe(false)
            expect(PublicValidator.__isValidPriceString('.99')).toBe(false)
        })

    })


    describe('Item Validator class test', () => {
        it('shoud correctly validate Item', () => {

            // Empty object
            expect(ItemValidator.validate(<Item>{}).valid).toBe(false)

            // Incomplete object
            expect(ItemValidator.validate(<Item>{
                shortDescription: 'Gatorade',
            }).valid).toBe(false)

            // Incomplete object
            expect(ItemValidator.validate(<Item>{
                price: '12.03',
            }).valid).toBe(false)

            // Wrong price format
            expect(ItemValidator.validate(<Item>{
                shortDescription: 'Gatorade',
                price: '12.3',
            }).valid).toBe(false)

            // Other type check are covered in base Validator class
            // ....

            expect(ItemValidator.validate(<Item>{
                shortDescription: 'Gatorade',
                price: '12.03',
            }).valid).toBe(true)
        })
    })


    describe('Receipt Validator class test', () => {
        it('shoud correctly validate Receipt', () => {

            // Empty object
            expect(ReceiptValidator.validate(<Receipt>{}).valid).toBe(false)

            // Incomplete items
            expect(ReceiptValidator.validate(<Receipt>{
                retailer: "M&M Corner Market",
                purchaseDate: "2022-03-20",
                purchaseTime: "14:33",
                items: [],
                total: "9.00"
            }).valid).toBe(false)

            // Other type check are covered in base Validator class
            // ....

            expect(ReceiptValidator.validate(<Receipt>{
                retailer: "M&M Corner Market",
                purchaseDate: "2022-03-20",
                purchaseTime: "14:33",
                items: [
                    {
                        shortDescription: "Gatorade",
                        price: "2.25"
                    }, {
                        shortDescription: "Gatorade",
                        price: "2.25"
                    }, {
                        shortDescription: "Gatorade",
                        price: "2.25"
                    }, {
                        shortDescription: "Gatorade",
                        price: "2.25"
                    }
                ],
                total: "9.00"
            }).valid).toBe(true)
        })
    })
    
})