import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import userModel from '../models/userModel.js'
import { connectDB } from '../config/db.js'

dotenv.config()

const authorities = JSON.parse(process.env.AUTHORITIES);

const seed = async () => {
  try {
    connectDB()
    for (const a of authorities) {
      const exists = await userModel.findOne({ email: a.email });
      if (exists) {
        console.log(`Skipped (exists): ${a.email}`);
        continue;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(a.password, salt);
      await userModel.create({
        name: a.name,
        email: a.email,
        password: hashedPw,
        role: 'dept_admin',
        authorityType: a.authorityType,
        department: a.department
      });
      console.log(`Created: ${a.email} / ${a.password}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();