export default function ReportCard({ title, description, date, location }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-3">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{location}</span>
        <span>{formatDate(date)}</span>
      </div>
    </div>
  );
}