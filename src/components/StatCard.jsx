export default function StatCard({ label, value }) {
  const formattedLabel = label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

  return (
    <div className="stat">
      <span className="stat-label">
        {formattedLabel}
      </span>

      <span className="stat-value">
        {value ?? 'N/A'}
      </span>
    </div>
  );
}