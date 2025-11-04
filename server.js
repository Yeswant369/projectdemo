require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const summaryEngine = require('./public/summarizers/summaryEngine');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/summarize', async (req, res) => {
    const { topic, type } = req.body;
    try {
        const summaryResult = await summaryEngine(topic, type);
        res.json(summaryResult);
    } catch (error) {
        console.error('Summary Error:', error);
        res.status(500).send({ error: 'Summary Failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Pixel Forge running on http://localhost:${PORT}`);
});
