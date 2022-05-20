const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const uri =
	"mongodb+srv://cleanCo:cleanCo@cluster0.do24a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const serviceCollection = client.db("cleanCo").collection("services");

		// get all service
		app.get("/get-service", async (req, res) => {
			const service = await serviceCollection.find().toArray();
			res.send(service);
		});

		// post a single service data
		app.post("/add-service", async (req, res) => {
			const service = req.body;
			const result = await serviceCollection.insertOne(service);
			res.send(result);
		});

		// update a single service
		app.put("/update-service/:id", async (req, res) => {
			const id = req.params.id;
			const service = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updatedDoc = { $set: service };

			const result = await serviceCollection.updateOne(
				filter,
				updatedDoc,
				options
			);
			res.send(result);
		});

		// delete a single service
		app.delete("/delete-service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await serviceCollection.deleteOne(query);
			res.send(result);
		});
	} finally {
	}
}

run().catch(console.dir);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
