const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'], // For now, this can only be 'admin', but could be expanded for multiple roles
  },
  permissions: {
    canAddTeacher: {
      type: Boolean,
      default: true
    },
    canRemoveTeacher: {
      type: Boolean,
      default: true
    },
    canManageStudents: {
      type: Boolean,
      default: true
    },
    canViewReports: {
      type: Boolean,
      default: true
    },
    canManageFees: {
      type: Boolean,
      default: true
    },
    canManageSettings: {
      type: Boolean,
      default: true
    },
    
  },
  rollNumber:{
    type: String,
    required:true,
    unique: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password); // Replace with your hashing logic
  }
  next();
});

const Admin = mongoose.model('admins', adminSchema);
module.exports = Admin;
