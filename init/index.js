const mongoose= require('mongoose');
const newData= require('../init/data.js');
const Listing= require('../models/listing.js');

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/test"); 
}
main()
     .then(()=>{
        console.log("connected to database");
     })
     .catch((err) => {
        console.log(err);
     });

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = newData.data.map((obj) => ({
    ...obj,
    owner: '68348eb16c11b273f85698a5',
  }));
  await Listing.insertMany(updatedData); // use updated data
  console.log("db init");
};

initDB();

