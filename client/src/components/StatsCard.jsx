
export default function StatsCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="surface p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="text-2xl font-bold text-heading">{value}</p>
      </div>
    </div>
  );
}
