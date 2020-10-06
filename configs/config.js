// name of dynamodb table
module.exports.tableName = "Tables";

//Blocked elements of items in a table for update
module.exports.blockedElements = {
	one: "tableId",
	two: "HotelId",
};
