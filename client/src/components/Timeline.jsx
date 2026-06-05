import { Check } from 'lucide-react';

const steps = [
  { key: 'registered', label: 'Complaint Registered' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

const timelineOrder = ['registered', 'under_review', 'in_progress', 'resolved'];

export default function Timeline({ currentTimeline, statusHistory = [] }) {
  const currentIndex = timelineOrder.indexOf(currentTimeline);

  const getTimestamp = (key) => {
    const entry = statusHistory.find((h) => h.status === key);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const timestamp = getTimestamp(step.key);

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-16 ${isCompleted && index < currentIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
            <div className="pb-8">
              <p className={`font-semibold ${isCompleted ? 'text-heading' : 'text-muted'}`}>
                {step.label}
              </p>
              {timestamp && <p className="text-sm text-muted mt-1">{timestamp}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
