const { Queue } = require('bullmq')

class Publisher {
	constructor(options = { serviceName: '', speakerName: '' }) {
		this._serviceName = options.serviceName
		this._speakerName = options.speakerName
	}

	queue() {
		const serviceName = new Queue(this._serviceName)
		return serviceName
	}

	async speaker(data, options) {
		await this.queue().add(this._speakerName, { ...data }, { ...options })
	}
}

module.exports = { Publisher }
