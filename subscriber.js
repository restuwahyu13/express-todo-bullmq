const { Worker } = require('bullmq')
const userSchema = require('./model.js')
const { resultsPublisher } = require('./publisher')
const consola = require('consola')

/**
 * @description queueCreatePublisher
 */

const queueCreatePublisher = new Worker(
	'create service',
	async (job) => {
		if (job.name == 'create:service') {
			queueCreatePublisher.emit('create:service', JSON.stringify({ data: job.data }))
		}
	},
	{ limiter: { duration: 3000, max: 25 } }
)

queueCreatePublisher.on('completed', (job) => consola.success(`job create completed ${job.id}`))
queueCreatePublisher.on('waiting', (job) => consola.info(`job create waiting ${job.id}`))
queueCreatePublisher.on('active', (job) => consola.info(`job create active ${job.id}`))
queueCreatePublisher.on('failed', (job) => consola.error(`job create failed ${job.id}`))

exports.createSubscriber = () => {
	return new Promise((resolve, reject) => {
		queueCreatePublisher.once('create:service', async (data) => {
			const response = await insertOne(JSON.parse(data).data)
			resolve(response)
		})
	})
}

function insertOne(res) {
	return new Promise(async (resolve, reject) => {
		try {
			const checkEmail = await userSchema.findOne({ email: res.email }).lean()
			if (checkEmail) {
				resolve({ statusCode: 409, message: 'todo already exist' })
			}
			const saveEmail = await userSchema.create({ email: res.email })
			if (saveEmail) {
				resolve({ statusCode: 201, message: 'add new todo successfully' })
			} else {
				resolve({ statusCode: 400, message: 'add new todo failed' })
			}
		} catch (err) {
			reject({ statusCode: 500, message: 'internal server error' })
		}
	})
}

/**
 * @description queueResultsPublisher
 */

const queueResultsPublisher = new Worker(
	'results service',
	async (job) => {
		if (job.name == 'results:service') {
			queueResultsPublisher.emit('results:service', JSON.stringify({ data: job.data }))
		}
	},
	{ limiter: { duration: 3000, max: 25 } }
)

queueResultsPublisher.on('completed', (job) => consola.success(`job results completed ${job.id}`))
queueResultsPublisher.on('waiting', (job) => consola.info(`job results waiting ${job.id}`))
queueResultsPublisher.on('active', (job) => consola.info(`job results active ${job.id}`))
queueResultsPublisher.on('failed', (job) => consola.error(`job results failed ${job.id}`))

exports.findAllSubscriber = async () => {
	await findAll()
	return new Promise((resolve, reject) => {
		queueResultsPublisher.once('results:service', (data) => {
			const response = JSON.parse(data).data
			resolve(response)
		})
	})
}

async function findAll() {
	try {
		const findAllEmail = await userSchema.find({}).lean()

		if (findAllEmail.length < 1) {
			await resultsPublisher({ statusCode: 404, message: 'todo is not exist', data: findAllEmail })
		} else {
			await resultsPublisher({ statusCode: 200, message: 'todo already to use', data: findAllEmail })
		}
	} catch (err) {
		await resultsPublisher({ statusCode: 500, message: 'internal server error' })
	}
}
