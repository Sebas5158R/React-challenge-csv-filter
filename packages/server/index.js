const express = require("express");
const multer = require('multer');
let csvToJson = require('convert-csv-to-json');
var cors = require('cors');

const PORT = process.env.PORT || 3001;

// Create an express server
const app = express();

app.use(cors()); // Enable CORS

// Multer config
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

let userData = [];

// Routes
app.get("/api", (req, res) => {
    res.json({message: "Welcome to the server!"});
})

// Upload file xlsx
app.post("/api/upload", upload.single('file'), async (req, res) => {
    // 1. Extract file from request
    const file = req.file;
    // 2. Validate that we have file
    if (!file) {
        return res.status(400).json({ message: "Please upload a file!" });
    }
    // 3. Validate the mimetype (csv)
    if (file.mimetype !== 'text/csv') {
        return res.status(400).json({ message: "Please upload a CSV file!" });
    }

    let json = [];

    try {
        // 4. Transform the file (Buffer) to string
        const csv = Buffer.from(file.buffer).toString('utf-8');
        // 5. Transform the string to json
        json = csvToJson.fieldDelimiter(',').csvStringToJson(csv);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error parsing the file!" });
    }

    // 6. Save the json in a global variable
    userData = json;

    // 7. Return the json
    return res.status(200).json({ data: json, message: "File uploaded successfully!" });
})

app.get("/api/users", async (req, res) => {
    // 1. Extract the query parameters 'q' from the request
    const { q } = req.query;
    // 2. Validate that we have the query parameter 'q'
    if (!q) {
        return res.status(400).json({ message: "Please provide a query parameter 'q'!" });
    }

    if (Array.isArray(q)) {
        return res.status(400).json({ message: "Please provide a single query parameter 'q'!" });
    }

    // 3. Filter the users based on the query parameter 'q'
    const search = q.toString().toLowerCase();
    const filteredUsers = userData.filter(user => {
        return Object.values(user).some(value => value.toLowerCase().includes(search));
    })
    // 4. Return the filtered users
    return res.status(200).json({ data: filteredUsers, message: "Users fetched successfully!" });
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
