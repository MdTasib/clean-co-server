const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
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

		app.get("/service", async (req, res) => {
			const service = await serviceCollection.find().toArray();
			res.send(service);
		});
	} finally {
	}
}

run().catch(console.dir);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
