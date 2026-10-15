import mongoose from "mongoose";

const DEPARTMENT_CATEGORIES = ['pothole', 'streetlight', 'garbage', 'drainage', 'water', 'sanitation', 'other'];

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['citizen', 'dept_admin', 'super_admin'],
            default: 'citizen'
        },
        authorityType: {
            type: String,
            enum: ['lsgi', 'pwd', 'kwa'],
            required: function () { return this.role === 'dept_admin'; }
        },
        localBody: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LocalBody',
            required: function () {
                return this.role === 'dept_admin' && this.authorityType === 'lsgi';
            }
        },
        department: {
            type: [String],
            enum: DEPARTMENT_CATEGORIES,
            default: [],
            validate: {
                validator: function (value) {
                    if (this.role === 'dept_admin') {
                        return Array.isArray(value) && value.length > 0;
                    }
                    return true;
                },
                message: 'At least one department/category must be assigned to a department admin'
            }
        },

        // NEW — password reset fields
        resetPasswordOtp: { type: String, select: false },       // hashed OTP, never returned by default
        resetPasswordOtpExpiry: { type: Date, select: false },
        resetPasswordVerified: { type: Boolean, default: false, select: false }, // true after OTP confirmed, before final reset
    },
    {timestamps: true}
)

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;