const express = require('express');
const app = express();
const port = 3000;

// Process database (simulating a small database of processes)
const processDatabase = {
    "Whatsapp": { pid: 1423, memory: "150 MB", status: "Running" },
    "Vscode": { pid: 2345, memory: "480 MB", status: "Running" },
    "Chrome": { pid: 1987, memory: "300 MB", status: "Running" },
    "file manager": { pid: 1927, memory: "563 MB", status: "Running" }
};

// API route to fetch process details
app.get('/get-process-details', (req, res) => {
    // Get process name from the query parameter
    const processName = req.query.process ? req.query.process.toLowerCase() : '';

    // Check if process exists in the database
    const processInfo = processDatabase[processName];

    if (processInfo) {
        // If process is found, send back the process details
        res.json(processInfo);
    } else {
        // If process not found, send back random process data
        const pid = Math.floor(Math.random() * 10000);
        const memory = (Math.random() * 500).toFixed(2) + " MB";
        const statuses = ["Sleeping", "Stopped"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        res.json({
            pid: pid,
            memory: memory,
            status: status
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
