// components/ReportCard.js
export default function ReportCard({ title, description, date, location }) {
  return (
    <div className="border p-4 rounded-lg mb-4 shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p>{description}</p>
      <div className="text-sm text-gray-500">
        <p>Date: {new Date(date).toLocaleString()}</p>
        <p>Location: {location}</p>
      </div>
    </div>
  );
}
