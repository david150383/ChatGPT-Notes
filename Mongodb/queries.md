db.users.find({ "address.country": "India" }).count();
db.users.find({ age: { $gt: 30 } });
db.users.find({ age: { $gt: 25, $lt: 30 } });
db.users.find({ status: "active" });
(10).db.users.find({ status: "inactive" }, { name: 1, email: 1 });


Tags is a array field ["value", "value"]
db.products.find({tags:"mobile"});
db.products.find({tags:{$in: ["mobile", "sports"]}});

db.users.find({ "address.country": "India" }).explain("executionStats")

COLLSCAN
nReturned: 10
totalDocsExamined: 5,000,000
totalKeysExamined: 0

That is when you should immediately start thinking about an index.

