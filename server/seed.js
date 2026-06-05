import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Complaint from './models/Complaint.js';
import connectDB from './config/db.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  await Complaint.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@complainthub.com',
    password: 'admin123',
    role: 'admin',
  });

  const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  });

  const categories = await Category.insertMany([
    { name: 'Infrastructure', description: 'Roads, buildings, facilities' },
    { name: 'Water Supply', description: 'Water quality and supply issues' },
    { name: 'Electricity', description: 'Power outages and electrical issues' },
    { name: 'Sanitation', description: 'Waste management and cleanliness' },
    { name: 'Other', description: 'Other complaints' },
  ]);

  const sampleComplaints = [
    {
      complaintId: 'CMP-2026-1001',
      title: 'Broken Street Light',
      category: categories[0]._id,
      description: 'Street light on Main Road has been broken for 2 weeks.',
      status: 'pending',
      timeline: 'registered',
      user: user._id,
      statusHistory: [{ status: 'registered', note: 'Complaint registered successfully' }],
    },
    {
      complaintId: 'CMP-2026-1002',
      title: 'Water Leakage',
      category: categories[1]._id,
      description: 'Water pipe leaking near Block A causing road damage.',
      status: 'in_progress',
      timeline: 'in_progress',
      user: user._id,
      statusHistory: [
        { status: 'registered', note: 'Complaint registered successfully' },
        { status: 'under_review', note: 'Under review by department' },
        { status: 'in_progress', note: 'Repair team assigned' },
      ],
    },
    {
      complaintId: 'CMP-2026-1003',
      title: 'Garbage Collection',
      category: categories[3]._id,
      description: 'Garbage not collected for 3 days in Sector 5.',
      status: 'resolved',
      timeline: 'resolved',
      user: user._id,
      statusHistory: [
        { status: 'registered', note: 'Complaint registered successfully' },
        { status: 'under_review', note: 'Under review' },
        { status: 'in_progress', note: 'Collection scheduled' },
        { status: 'resolved', note: 'Garbage collected successfully' },
      ],
    },
  ];

  await Complaint.insertMany(sampleComplaints);

  console.log('Database seeded successfully!');
  console.log('Admin: admin@complainthub.com / admin123');
  console.log('User:  john@example.com / user123');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
