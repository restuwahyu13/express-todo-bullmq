const { Publisher } = require('./utils/util.publisher')
const { setQueues, BullMQAdapter } = require('bull-board')

const createPublisher = new Publisher({ serviceName: 'create', speakerName: 'create:speaker' })
const resultsPublisher = new Publisher({ serviceName: 'results', speakerName: 'results:speaker' })

// init monitoring bullmq
setQueues([new BullMQAdapter(createPublisher.queue()), new BullMQAdapter(resultsPublisher.queue())])

exports.setRegisterPublisher = async (data) => {
	await createPublisher.speaker({ ...data }, { removeOnComplete: 25, removeOnFailL: 100 })
}

exports.setResultsPublisher = async (data) => {
	await resultsPublisher.speaker({ ...data }, { removeOnComplete: 25, removeOnFailL: 100 })
}
