import mongoose from "mongoose";
const db = mongoose.connection;
const url =
  "mongodb+srv://LoremasterAdmin:PswueLp9W5RxFNE0@babel.xbe7b.mongodb.net/mjref?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const initializeDB = () => {
  mongoose
    .connect(url, connectionParams)
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.error(`Error connecting to the database: \n${err}`);
    });
};

export { db, initializeDB };
