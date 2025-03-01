import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_CONNECTION;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
const connection = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('discordBot');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
  return db;
};

export default connection;
