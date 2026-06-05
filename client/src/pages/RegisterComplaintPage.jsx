import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../api/axios';

export default function RegisterComplaintPage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load categories. Please refresh the page.'))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setImage(null);
    setSubmitted(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      if (image) formData.append('image', image);

      const { data } = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(data);
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout title="Register Complaint" breadcrumb="Dashboard > Register Complaint">
        <div className="surface p-8 max-w-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-heading mb-2">Complaint Registered!</h2>
          <p className="text-muted mb-4">
            Your complaint has been submitted successfully. Save your Complaint ID to track progress.
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted">Your Complaint ID</p>
            <p className="text-2xl font-bold text-primary">{submitted.complaintId}</p>
          </div>
          <p className="text-sm text-body mb-6">
            <strong>{submitted.title}</strong> — Status: Pending review by admin
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={`/track?id=${submitted.complaintId}`}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
            >
              Track Complaint
            </Link>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5"
            >
              Register Another
            </button>
            <button
              onClick={() => navigate('/my-complaints')}
              className="px-6 py-2.5 text-body hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
            >
              My Complaints
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Register Complaint" breadcrumb="Dashboard > Register Complaint">
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Register a new complaint</strong> — Fill in the details below. Once submitted, an admin will review and resolve your complaint. You can track progress anytime using your Complaint ID.
        </p>
      </div>

      <div className="surface p-8 max-w-2xl">
        {error && <div className="alert-error mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-label mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter complaint title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-label mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
              required
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {!loadingCategories && categories.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                No categories available. Ask admin to add categories.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-label mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-field resize-none"
              placeholder="Describe your complaint in detail — location, date, impact, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-label mb-1">Upload Image (Optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted mb-2" />
              <span className="text-sm text-muted">
                {image ? image.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || loadingCategories || categories.length === 0}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
