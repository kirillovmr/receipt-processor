/**
 * 
 */
export interface Item {
    shortDescription: string    // "Mountain Dew 12PK"  // "^\\S+$"
    price: string               // "6.49"               // "^\\d+\\.\\d{2}$"
}

/**
 * 
 */
export interface Receipt {
    retailer: string        // "Target"         // "^\\S+$"
    purchaseDate: string    // "2022-01-01"     // year-m-d
    purchaseTime: string    // "13:01"
    total: string           // "6.49"           // "^\\d+\\.\\d{2}$"
    items: Item[]
}

/**
 * 
 */
export interface ValidateResult {
    valid: boolean
    error: string
}