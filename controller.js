const { setRegisterPublisher } = require('./publisher')
const { getRegisterSubscriber, getResultsSubscriber } = require('./subscriber.js')

exports.controller = {
	createController: async (req, res) => {
		await setRegisterPublisher({ fullname: req.body.fullname, emai: req.body.email })
		const data = await getRegisterSubscriber()
		return res.status(200).json({ ...data })
	},
	resultsController: async (req, res) => {
		const data = await getResultsSubscriber()
		return res.status(200).json({ ...data })
	}
}
