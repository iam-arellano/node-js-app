const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Get MongoDB connection details from environment variables
const mongoHost = process.env.MONGO_HOST || 'mongodb';  // Default to 'mongodb' service name
const mongoPort = process.env.MONGO_PORT || '27017';    // Default MongoDB port
const mongoDB = process.env.MONGO_DB || 'cruddb';       // Default database name
const mongoUser = process.env.MONGO_USER;               // MongoDB username
const mongoPass = process.env.MONGO_PASS;               // MongoDB password

// Construct the MongoDB connection URI
const mongoURI = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDB}?authSource=admin`;

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model('Item', ItemSchema);

// Create
app.post('/items', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send({ message: 'Error creating item', error });
    }
});

// Read
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (error) {
        res.status(400).send({ message: 'Error fetching items', error });
    }
});

// Update
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).send({ message: 'Item not found' });
        }
        res.send(item);
    } catch (error) {
        res.status(400).send({ message: 'Error updating item', error });
    }
});

// Delete
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send({ message: 'Item not found' });
        }
        res.send({ message: 'Item deleted' });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting item', error });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;
