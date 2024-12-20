const mongoose=require('mongoose');

const MONGO_URI = "mongodb+srv://projectuser:bEYaXh4XDPbg7v1u@schoolmanagementsystem.aka0c.mongodb.net/?retryWrites=true&w=majority&appName=SchoolManagementSystem";




const connectToMongo = () => {
  mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB successfully');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};
module.exports=connectToMongo;
