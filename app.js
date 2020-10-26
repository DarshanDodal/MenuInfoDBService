const serverless = require("serverless-http");
const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid");
const {
	tableName,
	blockedElements,
	dbTemplate,
} = require("./configs/config.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

AWS.config.update({ region: "ap-south-1" });
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

// Use this to get all dynamodb items.
/*app.get("/", (req, res) => {
	var params = {
		TableName: tableName,
	};

	dynamoDBClient.query(params, function (err, data) {
		if (err) {
			//console.log(err);
			res.send({ error: true, message: err.message });
		} else {
			res.send({
				error: false,
				message: "Data fetched successfully.",
				data: data,
			});
		}
	});
});*/

// Use this to get a specific dynamodb item.
app.get("/get-one/:id/", (req, res) => {
	const params = {
		TableName: tableName,
		Key: {
			HotelId: req.query.hotel,
			dishId: req.params.dish,
		},
	};
	dynamoDBClient.get(params, function (err, data) {
		if (err) {
			//console.log(err);
			res.send({ error: true, message: err.message });
		} else {
			res.send({
				error: false,
				message: "Data fetched successfully.",
				data: data,
			});
		}
	});
});

//use this to get all dishes in a specific restaurant
app.get("/", (req, res) => {
	const params = {
		TableName: tableName,
		KeyConditionExpression: "#id = :hid",
		ExpressionAttributeNames: {
			"#id": "HotelId",
		},
		ExpressionAttributeValues: {
			":hid": req.query.hotel,
		},
	};

	dynamoDBClient.query(params, function (err, data) {
		if (err) {
			//console.log(err);
			res.send({ error: true, message: err.message });
		} else {
			res.send({
				error: false,
				message: "Data fetched successfully.",
				data: data,
			});
		}
	});
});

//Use this to add new items in database.
app.post("/", (req, res) => {
	const uuidKey = uuid.v4() + uuid.v4();
	const dishuuid = uuidKey.slice(
		uuidKey.length / 2 - 3,
		uuidKey.length / 2 + 3
	);
	console.log(dishuuid);
	var params = {
		TableName: tableName,
		Item: {
			HotelId: req.query.hotel,
			dishId: dishuuid,
			name: req.query.name,
			price: req.query.price,
			category: req.query.category,
			subCategory: req.query.subCategory,
		},
	};

	dynamoDBClient.put(params, function (err, data) {
		if (err) {
			res.send({
				error: true,
				message: err.message,
			});
		} else {
			res.send({
				error: false,
				message: "Item Created successfully.",
			});
		}
	});
});

//use this to update a parameter of specific item
app.patch("/update-one/:id", (req, res) => {
	var params = {
		TableName: tableName,
		Key: {
			HotelId: req.query.hotel,
			dishId: req.params.dish,
		},
		UpdateExpression: "set #st = :r",
		ExpressionAttributeNames: {
			"#st": `${req.query.update}`,
		},
		ExpressionAttributeValues: {
			":r": req.query.value,
		},
		ReturnValues: "UPDATED_NEW",
	};

	if (
		req.query.update === blockedElements.one ||
		req.query.update === blockedElements.two
	) {
		res.send({
			error: true,
			message: `${req.query.update} cannot be edited.`,
		});
	}
	dynamoDBClient.update(params, function (err, data) {
		if (err) {
			res.send({
				error: true,
				message: err.message,
			});
		} else {
			res.send({
				error: false,
				message: "Item Updated successfully.",
			});
		}
	});
});

//use this to delete an item
app.delete("/delete-one/:id", (req, res) => {
	var params = {
		TableName: tableName,
		Key: {
			HotelId: req.query.hotel,
			dishId: req.params.dish,
		},
	};
	dynamoDBClient.delete(params, function (err, data) {
		if (err) {
			//console.log(err);
			res.send({
				error: true,
				message: err.message,
			});
		} else {
			res.send({
				error: false,
				message: "Item Deleted successfully.",
			});
		}
	});
});

app.listen(3000, () => console.log(`Listening on: 3000`));
//module.exports.handler = serverless(app);
