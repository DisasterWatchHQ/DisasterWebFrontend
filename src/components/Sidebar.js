// components/Sidebar.js
export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h2 className="text-xl font-bold mb-4">DisasterWatch</h2>
      <ul className="space-y-2">
        <li>
          <a href="/map" className="hover:text-blue-400">
            Map
          </a>
        </li>
        <li>
          <a href="/feed" className="hover:text-blue-400">
            Feed
          </a>
        </li>
        <li>
          <a href="/resources" className="hover:text-blue-400">
            Resources
          </a>
        </li>
      </ul>
    </div>
  );
}
