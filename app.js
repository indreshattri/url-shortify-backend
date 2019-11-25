const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const URLRoutes = require('./api/routes/url');


//Database Connection via mongoose
mongoose.connect('mongodb+srv://indreshattri:1234@urlshortener-i0s8x.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true
}).then(() => {
		console.log('Database Connected');
	})
	.catch(err => { 
        console.error(err.stack);
        process.exit(1);
    });



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// To avoid CORS errors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin","*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);

	if(req.methods === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, PATCH');
		return res.status(200).json({});
	}

	next();
});

app.use('/api/item', URLRoutes);


app.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Welcome to reTwitter'
	});
});


//Error Handling for main page
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
