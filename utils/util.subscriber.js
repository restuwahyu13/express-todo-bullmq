const { Worker, QueueEvents } = require('bullmq')
const consola = require('consola')

class Subscriber {
	constructor(options = { serviceName: '', listenerName: '' }) {
		this._serviceName = options.serviceName
		this._listenerName = options.listenerName
		this._queueEvent = new QueueEvents(this._serviceName)
	}

	_worker() {
		new Worker(
			this._serviceName,
			async (job) => {
				if (job.name == this._listenerName) {
					this._queueEvent.emit(this._listenerName, JSON.stringify({ data: job.data }))
					return job.name
				}
			},
			{ limiter: { duration: 3000, max: 25 } }
		)
	}

	_notifications() {
		this._worker()
		this._queueEvent.on('completed', (job) => consola.success(`${this._listenerName} completed ${job.jobId}`))
		this._queueEvent.on('waiting', (job) => consola.info(`${this._listenerName} waiting ${job.jobId}`))
		this._queueEvent.on('active', (job) => consola.info(`${this._listenerName} active ${job.jobId}`))
		this._queueEvent.on('failed', (job) => consola.error(`${this._listenerName} failed ${job.jobId}`))
	}

	listener() {
		this._notifications()
		return new Promise((resolve, _) => {
			this._queueEvent.once(this._listenerName, async (data) => {
				resolve(JSON.parse(data).data)
			})
		})
	}
}

module.exports = { Subscriber }
