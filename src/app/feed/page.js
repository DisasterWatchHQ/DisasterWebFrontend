'use client';

import ReportCard from "@/components/ReportCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useReports } from "@/hooks/useReports";

export default function Feed() {
  const { reports, loading, error, refreshReports } = useReports();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Disaster Feed</h1>
            <button 
              onClick={refreshReports}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}

          {!loading && !error && reports.length === 0 && (
            <p className="text-center text-gray-500">No reports available.</p>
          )}

          {reports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
      </main>
    </div>
  );
}