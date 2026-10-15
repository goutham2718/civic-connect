import userModel from '../models/userModel.js'
import LocalBody from '../models/LocalbodyModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'

const DEPARTMENT_CATEGORIES = ['pothole', 'streetlight', 'garbage', 'drainage', 'water', 'sanitation', 'other'];

export const createDeptAdmin = async (req, res) => {
  const { name, email, password, authorityType, localBody, department } = req.body;
  try {
    if (!['lsgi', 'pwd', 'kwa'].includes(authorityType)) {
      return res.status(400).json({ success: false, message: 'authorityType must be lsgi, pwd, or kwa' });
    }

    if (authorityType === 'lsgi') {
      if (!localBody) {
        return res.status(400).json({ success: false, message: 'localBody is required for an LSGI admin' });
      }
      const localBodyExists = await LocalBody.findById(localBody);
      if (!localBodyExists) {
        return res.status(400).json({ success: false, message: 'Invalid localBody selected' });
      }
    }

    if (!Array.isArray(department) || department.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one department/category must be assigned' });
    }
    const invalid = department.filter(d => !DEPARTMENT_CATEGORIES.includes(d));
    if (invalid.length > 0) {
      return res.status(400).json({ success: false, message: `Invalid category(s): ${invalid.join(', ')}` });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    await userModel.create({
      name,
      email,
      password: hashedPw,
      role: 'dept_admin',
      authorityType,
      localBody: authorityType === 'lsgi' ? localBody : undefined,
      department
    });

    res.status(201).json({ success: true, message: 'Department admin created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create department admin'});
  }
};

// GET /api/admin/admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await userModel
      .find({ role: { $in: ['dept_admin', 'super_admin'] } })
      .select('-password');
    res.json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins'});
  }
};

// PATCH /api/admin/admins/:id
export const updateAdminDepartments = async (req, res) => {
  try {
    const { department } = req.body;
    const admin = await userModel.findById(req.params.id);

    if (!admin || admin.role !== 'dept_admin') {
      return res.status(404).json({ success: false, message: 'Department admin not found' });
    }

    if (!Array.isArray(department) || department.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one department must be assigned' });
    }

    const invalid = department.filter(d => !DEPARTMENT_CATEGORIES.includes(d));
    if (invalid.length > 0) {
      return res.status(400).json({ success: false, message: `Invalid department(s): ${invalid.join(', ')}` });
    }

    admin.department = department;
    await admin.save();

    res.json({ success: true, message: 'Departments updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update departments'});
  }
};

// DELETE /api/admin/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await userModel.findById(req.params.id);
    if (!admin || admin.role !== 'dept_admin') {
      return res.status(404).json({ success: false, message: 'Department admin not found' });
    }
    await admin.deleteOne();
    res.json({ success: true, message: 'Department admin removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete admin'});
  }
};