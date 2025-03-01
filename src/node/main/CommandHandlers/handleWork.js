import replyAndClean from '../CleanAfter/replyAndClean.js';
import axios from 'axios';
import { load } from 'cheerio';
import connection from '../Database/mongo.js';

import dotenv from 'dotenv';
dotenv.config();

const url = process.env.WEBSITE1;

const handleWork = async (message) => {
  const db = await connection();
  const collection = db.collection('jobs');
  let jobTitles = [];
  await collection.insertOne({ id: '123', title: 'Software Engineer' });
  console.log('Job inserted!');
  // try {
  //   const response = await axios.get(url);
  //   const $ = load(response.data);
  //   $("article[data-component='jobad']").each((index, job) => {
  //     const title = $(job).find('h2').text().trim();
  //     jobTitles.push(title);
  //   });
  //   console.log(jobTitles.join('\n'));

  //   // jobTitles = jobTitles.map((item) => item + '\n');
  //   replyAndClean(message, jobTitles.join('\n'));
  // } catch (error) {
  //   replyAndClean(message, 'Spamming with work data.');
  //   console.error(error);
  // }
};

export default handleWork;
