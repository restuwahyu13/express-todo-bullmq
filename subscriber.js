const userSchema = require('./model.js')
const { Subscriber } = require('./utils/util.subscriber')
const { setResultsPublisher } = require('./publisher')

const createSubscriber = new Subscriber({ serviceName: 'create', listenerName: 'create:speaker' })
const resultsSubscriber = new Subscriber({ serviceName: 'results', listenerName: 'results:speaker' })

/**
 * @description createSubscriber
 */

exports.getRegisterSubscriber = () => {
	return new Promise((resolve, _) => {
		createSubscriber.listener().then(async (res) => {
			try {
				const checkEmail = await userSchema.findOne({ email: res.email }).lean()
				if (checkEmail) {
					resolve({ statusCode: 409, message: 'todo already exist' })
				} else {
					const saveEmail = await userSchema.create({ fullname: res.fullname, email: res.email })
					if (saveEmail) {
						resolve({ statusCode: 201, message: 'add new todo successfully' })
					} else {
						resolve({ statusCode: 400, message: 'add new todo failed' })
					}
				}
			} catch (err) {
				reject({ statusCode: 500, message: 'internal server error' })
			}
		})
	})
}

/**
 * @description resultsSubscriber
 */

exports.getResultsSubscriber = async () => {
	try {
		const findAllEmail = await userSchema.find({}).lean()
		if (findAllEmail.length < 1) {
			await setResultsPublisher({ statusCode: 404, message: 'todo is not exist', data: findAllEmail })
		} else {
			await setResultsPublisher({ statusCode: 200, message: 'todo already to use', data: findAllEmail })
		}
		return resultsSubscriber.listener()
	} catch (err) {
		await setResultsPublisher({ statusCode: 500, message: 'internal server error' })
		return resultsSubscriber.listener()
	}
}
