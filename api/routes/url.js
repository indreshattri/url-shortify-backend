const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const shortid = require("shortid");
const URL = require('../models/url');


//create new url
router.post('/create' , (req, res, next) => {
	const urlRegex =/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	const urlParam = req.body.url;
	if(urlRegex.test(urlParam)) {
		URL.find({ originalUrl: urlParam })
			.exec()
			.then( result=> {
				if(result.length > 0) {
					return res.status(200).json({
						status: 'OK',
						item: result[0]
					})
				}
			})
			.catch(err => {
				return res.status(501).json({
					message: "Some error occured",
					error: err
				})
			})
	}else {
		return res.status(400).json({
			message: "Invalid Url",
			error: "urlInvalid"
		})
	}
	const host = 'http://localhost/';
	const uniqueCode = shortid.generate();
	let shortenedUrl = host + uniqueCode;
	const url = new URL ({
		_id: new mongoose.Types.ObjectId(),
		originalUrl: urlParam,
		shortenedUrl: shortenedUrl,
		uniqueCode: uniqueCode,
		numberOfVisits: 0
	});
	url
		.save()
		.then(result => {
			return res.status(200).json({
				status: 'OK',
				item: result
			})
		})
		.catch(err => {
			console.log(err);
			return res.status(501).json({
				message: "Some error occured",
				error: err
			})
		})
});


router.get('/get/:uniqueCode', (req,res,next ) => {
	const uniqueCode = req.params.uniqueCode;
	URL.findOne({ uniqueCode: uniqueCode})
		.exec()
		.then(result => {
			result.lastHitAt = Date.now();
			result.numberOfVisits += 1;
			result
				.save()
				.then();
			return res.redirect(result.originalUrl);
		})
		.catch(err => {
			console.log(err);
			return res.status(501).json({
				message: "Some error occured",
				error: err
			})
		})
})

router.get('/getAll', (req,res,next) => {
	URL.find()
	   .limit(10)
	   .sort({numberOfVisits: 'desc'})
	   .exec()
	   .then(result => {
	   		return res.status(201).json({
	   			status : "OK",
	   			urls: result
	   		})
	   })
	   .catch(err=> {
	   		console.log(err);
	   		res.status(501).json({
	   			message: "Some error occured",
	   			error: err
	   		})
	   })
})

module.exports = router;