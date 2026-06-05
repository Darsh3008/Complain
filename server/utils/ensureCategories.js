import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
  { name: 'Infrastructure', description: 'Roads, buildings, facilities' },
  { name: 'Water Supply', description: 'Water quality and supply issues' },
  { name: 'Electricity', description: 'Power outages and electrical issues' },
  { name: 'Sanitation', description: 'Waste management and cleanliness' },
  { name: 'Noise Pollution', description: 'Excessive noise complaints' },
  { name: 'Other', description: 'Other complaints' },
];

const ensureCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('Default categories created');
  }
};

export default ensureCategories;
