import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.ts"
import app from './app.ts'

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer()