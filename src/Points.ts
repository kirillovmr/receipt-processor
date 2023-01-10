import { Receipt } from "./types"

/**
 * Returns the amount of points granted
 *  for the given receipt
 */
export function calculatePoints(receipt: Receipt) {
    let points = 0

    // Get cents only (trim anything before . inclusively)
    const totalRemainder = receipt.total.split('.').pop()

    // One point for every alphanumeric character in the retailer name.
    points += receipt.retailer.replace(/[^a-z0-9]/gi, '').length

    // 50 points if the total is a round dollar amount with no cents.
    if (totalRemainder === '00') {
        points += 50
    }

    // 25 points if the total is a multiple of 0.25.
    if (totalRemainder === '00' || totalRemainder === '25' || totalRemainder === '50' || totalRemainder === '75') {
        points += 25
    }

    // 5 points for every two items on the receipt.
    points += Math.floor(receipt.items.length / 2) * 5

    // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. 
    //  The result is the number of points earned.
    for (const item of receipt.items) {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2)
        }
    }

    // 6 points if the day in the purchase date is odd.
    const purchaseDay = parseInt(receipt.purchaseDate.split('-').pop())
    if (purchaseDay % 2 === 1) {
        points += 6
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    const purchaseTime = parseInt(receipt.purchaseTime.replace(':', ''))
    if (1400 < purchaseTime && purchaseTime < 1600) {
        points += 10
    }

    return points
}