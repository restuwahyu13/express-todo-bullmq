const util = require('util')
const { createPublisher } = require('./publisher')
const { createSubscriber, findAllSubscriber } = require('./subscriber.js')

exports.controller = {
	createController: async (req, res) => {
		const email = req.body.email
		await createPublisher({ email })
		const data = await createSubscriber()

		return res.status(200).json({ ...data })
	},
	resultsController: async (req, res) => {
		const data = await findAllSubscriber()
		return res.status(200).json({ ...data })
	}
}
