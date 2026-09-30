/**
 * One-shot script — creates an admin user in MongoDB.
 * Run from the backend root:  node scripts/createAdmin.js
 */

require('dotenv').config();          // loads .env → MONGODB_URI
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Inline the minimal schema so we don't need to boot the full app ────────
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone:    { type: String, required: true, trim: true },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: { type: Array, default: [] },
    wishlist:  { type: Array, default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ── Admin credentials ──────────────────────────────────────────────────────
const ADMIN = {
  name:     'Sattar Kureshi',
  email:    'rizlaboutique@gmail.com',
  phone:    '9079521298',
  password: 'Rizla@123',
  role:     'admin',
};

(async () => {
  try {
    console.log('\nConnecting to MongoDB…');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.\n');

    // Check for existing account
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log(`A user with email "${ADMIN.email}" already exists.`);
      console.log(`  Role: ${existing.role}`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('  → Role upgraded to admin.');
      } else {
        console.log('  → Already an admin. Nothing changed.');
      }
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

    // Create admin
    const admin = await User.create({
      name:     ADMIN.name,
      email:    ADMIN.email,
      phone:    ADMIN.phone,
      password: hashedPassword,
      role:     'admin',
    });

    console.log('Admin account created successfully!');
    console.log('─────────────────────────────────');
    console.log(`  ID    : ${admin._id}`);
    console.log(`  Name  : ${admin.name}`);
    console.log(`  Email : ${admin.email}`);
    console.log(`  Phone : ${admin.phone}`);
    console.log(`  Role  : ${admin.role}`);
    console.log('─────────────────────────────────');
    console.log('You can now log in at /admin/login\n');

  } catch (err) {
    console.error('\nFailed to create admin:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
