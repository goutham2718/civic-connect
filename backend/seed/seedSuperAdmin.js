import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import userModel from '../models/userModel.js'
import { connectDB } from '../config/db.js'

dotenv.config()

const seedSuperAdmin = async () => {
  try {
    connectDB();

    const existing = await userModel.findOne({ role: 'super_admin' })
    if (existing) {
      console.log('A super admin already exists:', existing.email)
      process.exit(0)
    }

    const email = process.env.SUPER_ADMIN_EMAIL
    const plainPassword = process.env.SUPER_ADMIN_PASSWORD

    const salt = await bcrypt.genSalt(10)
    const hashedPw = await bcrypt.hash(plainPassword, salt)

    await userModel.create({
      name: 'Super Admin',
      email,
      password: hashedPw,
      role: 'super_admin'
    })

    console.log('✅ Super admin created')
    console.log('⚠️  Log in and change this password immediately.')

    process.exit(0)
  } catch (err) {
    console.error('Failed to seed super admin:', err)
    process.exit(1)
  }
}

seedSuperAdmin()