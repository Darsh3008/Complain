import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const SETTINGS_KEY = 'complainthub_settings';

const defaultSettings = {
  systemName: 'ComplaintHub',
  supportEmail: 'support@complainthub.com',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SETTINGS_KEY);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setMessage('Settings saved successfully');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <DashboardLayout title="Settings" breadcrumb="Dashboard > Settings" isAdmin>
      <div className="surface p-8 max-w-lg">
        <h3 className="font-semibold text-heading mb-4">System Settings</h3>
        {message && <div className="alert-success mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-label mb-1">System Name</label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-label mb-1">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
