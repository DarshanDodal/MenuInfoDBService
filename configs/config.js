// name of dynamodb table
module.exports.tableName = "Menu";

//Blocked elements of items in a table for update
module.exports.blockedElements = {
	one: "dishId",
	two: "HotelId",
};
