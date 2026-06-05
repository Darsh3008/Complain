import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      setMessage('Category added successfully');
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    setError('');
    setMessage('');
    try {
      await api.delete(`/categories/${id}`);
      setMessage('Category deleted');
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Failed to delete category');
    }
  };

  return (
    <DashboardLayout title="Categories" breadcrumb="Dashboard > Categories" isAdmin>
      {error && <div className="alert-error mb-4">{error}</div>}
      {message && <div className="alert-success mb-4">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="surface p-6">
          <h3 className="font-semibold text-heading mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Category name"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Description (optional)"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {submitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 surface p-6">
          <h3 className="font-semibold text-heading mb-4">All Categories</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-muted text-center py-8">No categories yet</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-heading">{cat.name}</p>
                    {cat.description && <p className="text-sm text-muted">{cat.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
