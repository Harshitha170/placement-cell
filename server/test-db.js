const mongoose = require('mongoose');

const uri = "mongodb+srv://user:admin123@careerbridge-cluster.evo6t5a.mongodb.net/placement-cell?appName=careerbridge-cluster";

mongoose.connect(uri)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
