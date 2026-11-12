export default function StatCard({ label, value }) {
  if (value === null || value === undefined || value === '' || value === 'N/A' || value === 0) {
    return null;
  }

  const formattedLabel = label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

  return (
    <div className="stat">
      <span className="stat-label">
        {formattedLabel}
      </span>
      <span className="stat-value">
        {value}
      </span>
    </div>
  );
}