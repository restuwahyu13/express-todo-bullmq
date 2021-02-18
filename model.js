const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	fullname: {
		type: String,
		trim: true,
		requried: [true, 'fullname is required']
	},
	email: {
		type: String,
		trim: true,
		requried: [true, 'email is required']
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
})

module.exports = mongoose.model('todo', Schema)
