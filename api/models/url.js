const mongoose = require('mongoose');

const URLSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	originalUrl: { type: String, required: true },
	shortenedUrl: { type: String, required: true },
	numberOfVisits: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
	lastHitAt: { type: Date, default: Date.now },
	uniqueCode: { type: String, required: true },
});


module.exports = mongoose.model('Url',URLSchema);