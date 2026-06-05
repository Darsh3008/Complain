import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Complaint from '../models/Complaint.js';
import { protect, adminOnly } from '../middleware/auth.js';
import generateComplaintId from '../utils/generateComplaintId.js';

const router = express.Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Only image files are allowed'), ext && mime);
  },
});

const timelineToStatus = {
  registered: 'pending',
  under_review: 'pending',
  in_progress: 'in_progress',
  resolved: 'resolved',
};

const statusToTimeline = {
  pending: 'under_review',
  in_progress: 'in_progress',
  resolved: 'resolved',
};

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    let complaintId = generateComplaintId();
    let exists = await Complaint.findOne({ complaintId });
    while (exists) {
      complaintId = generateComplaintId();
      exists = await Complaint.findOne({ complaintId });
    }

    const complaint = await Complaint.create({
      complaintId,
      title,
      category,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      user: req.user._id,
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('category', 'name')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/track/:complaintId', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId })
      .populate('category', 'name')
      .populate('user', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.countDocuments({ ...filter, status: 'pending' }),
      Complaint.countDocuments({ ...filter, status: 'in_progress' }),
      Complaint.countDocuments({ ...filter, status: 'resolved' }),
    ]);

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/resolve-queue', protect, adminOnly, async (_req, res) => {
  try {
    const complaints = await Complaint.find({ status: { $ne: 'resolved' } })
      .populate('category', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('category', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const nextTimelineStep = {
  registered: 'under_review',
  under_review: 'in_progress',
  in_progress: 'resolved',
};

const timelineLabels = {
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

router.put('/:id/resolve', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status === 'resolved') {
      return res.status(400).json({ message: 'Complaint is already resolved' });
    }

    const nextTimeline = nextTimelineStep[complaint.timeline];
    if (!nextTimeline) {
      return res.status(400).json({ message: 'Cannot advance complaint from current state' });
    }

    const { note } = req.body;
    complaint.timeline = nextTimeline;
    complaint.status = timelineToStatus[nextTimeline];
    complaint.statusHistory.push({
      status: nextTimeline,
      note: note || `Complaint moved to ${timelineLabels[nextTimeline]}`,
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('category', 'name')
      .populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { status, timeline, note } = req.body;

    if (timeline) {
      complaint.timeline = timeline;
      complaint.status = timelineToStatus[timeline] || complaint.status;
      complaint.statusHistory.push({
        status: timeline,
        note: note || `Status updated to ${timeline.replace('_', ' ')}`,
      });
    } else if (status) {
      complaint.status = status;
      complaint.timeline = statusToTimeline[status] || complaint.timeline;
      complaint.statusHistory.push({
        status: complaint.timeline,
        note: note || `Status updated to ${status.replace('_', ' ')}`,
      });
    }

    if (req.body.title) complaint.title = req.body.title;
    if (req.body.description) complaint.description = req.body.description;
    if (req.body.category) complaint.category = req.body.category;

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('category', 'name')
      .populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.image) {
      const filePath = path.join(process.cwd(), complaint.image.replace(/^\//, ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
