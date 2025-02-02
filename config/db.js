const mongoose=require('mongoose');

const MONGO_URI = process.env.MONGO_URI;





const connectToMongo = () => {
  mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB successfully');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};
module.exports=connectToMongo;
