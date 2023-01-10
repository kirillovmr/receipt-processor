import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Receipt } from './types'
import { ReceiptValidator } from './Validator'

const app = express()
const port = 3000

app.use(express.json())



const RECEIPTS: {
    [key: string]: Receipt
} = {}



function calculatePoints(receipt: Receipt) {
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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/receipts/process', (req, res) => {
    const receipt: Receipt = req.body

    // Validate receipt schema
    const receiptValidatorRes = ReceiptValidator.validate(receipt)
    if (!receiptValidatorRes.valid) {
        return res
            .status(400)
            .send(`The receipt is invalid: ${receiptValidatorRes.error}`)
    }

    // Generate unique id
    const id = uuidv4()

    // Save receipts
    RECEIPTS[id] = receipt

    // Respond to user
    res.status(200).json({
        id,
    })
})

app.get('/receipts/:id/points', (req, res) => {
    const { id } = req.params

    // Retrieve the receipt
    const receipt = RECEIPTS[id]

    if (!receipt) return res.json('No receipt found')

    // Get the number of awarded points
    const points = calculatePoints(receipt)

    // Respond to user
    res.json({
        points,
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const r: Receipt = {
    "retailer": "Target",
    "purchaseDate": "2022-01-01",
    "purchaseTime": "13:01",
    "items": [
        {
            "shortDescription": "Mountain Dew 12PK",
            "price": "6.49"
        }, {
            "shortDescription": "Emils Cheese Pizza",
            "price": "12.25"
        }, {
            "shortDescription": "Knorr Creamy Chicken",
            "price": "1.26"
        }, {
            "shortDescription": "Doritos Nacho Cheese",
            "price": "3.35"
        }, {
            "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
            "price": "12.00"
        }
    ],
    "total": "35.35"
}
const r2: Receipt = {
    "retailer": "M&M Corner Market",
    "purchaseDate": "2022-03-20",
    "purchaseTime": "14:33",
    "items": [
        {
            "shortDescription": "Gatorade",
            "price": "2.25"
        }, {
            "shortDescription": "Gatorade",
            "price": "2.25"
        }, {
            "shortDescription": "Gatorade",
            "price": "2.25"
        }, {
            "shortDescription": "Gatorade",
            "price": "2.25"
        }
    ],
    "total": "9.00"
}

// console.log(calculatePoints(r2))