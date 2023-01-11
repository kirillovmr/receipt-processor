import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import { ReceiptValidator } from './Validator'
import { calculatePoints } from './Points'

import { Receipt } from './types'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())


/**
 * Key-value database alternative
 *  Stores receipts by their id
 */
const RECEIPTS: {
    [key: string]: Receipt
} = {}


/**
 * Return a project description file on base page load
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


/**
 * Submits a receipt for processing
 */
app.post('/receipts/process', (req, res) => {
    const receipt: Receipt = req.body

    // Validate receipt schema
    const receiptValidatorRes = ReceiptValidator.validate(receipt)
    if (!receiptValidatorRes.valid) {
        return res
            .status(400)
            .send(`v: ${receiptValidatorRes.error}`)
    }

    // Generate unique id
    const id = uuidv4()

    // Save receipts
    RECEIPTS[id] = receipt

    // Respond to user
    return res
        .status(200)
        .json({
            id,
        })
})


/**
 * Returns the points awarded for the receipt
 */
app.get('/receipts/:id/points', (req, res) => {
    const { id } = req.params

    // Retrieve the receipt
    const receipt = RECEIPTS[id]

    if (!receipt) {
        return res
            .status(404)
            .send('No receipt found for that id')
    }

    // Get the number of awarded points
    const points = calculatePoints(receipt)

    // Respond to user
    return res
        .status(200)
        .json({
            points,
        })
})


app.listen(port, () => {
    console.log(`Receipt processor app listening on port ${port}`)
})