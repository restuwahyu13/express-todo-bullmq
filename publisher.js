const { Queue } = require('bullmq')
const { setQueues, BullMQAdapter } = require('bull-board')

const queueCreatePublisher = new Queue('create service')
const queueResultsPublisher = new Queue('results service')

// init monitoring bullmq
setQueues([new BullMQAdapter(queueCreatePublisher), new BullMQAdapter(queueResultsPublisher)])

exports.createPublisher = async (data) => {
	await queueCreatePublisher.add('create:service', { ...data }, { removeOnComplete: 25, removeOnFailL: 100 })
}

exports.resultsPublisher = async (data) => {
	await queueResultsPublisher.add('results:service', { ...data }, { removeOnComplete: 25, removeOnFailL: 100 })
}
