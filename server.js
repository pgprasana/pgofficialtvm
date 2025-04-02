const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/expand", async (req, res) => {
    const { shortUrl } = req.body;

    if (!shortUrl || !shortUrl.includes("amzn.in/")) {
        return res.status(400).json({ error: "Invalid Amazon short link" });
    }

    try {
        const response = await axios.get(shortUrl, { maxRedirects: 5 });
        res.json({ expandedUrl: response.request.res.responseUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to expand the link" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
