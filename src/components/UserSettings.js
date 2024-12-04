// components/UserSettings.js
import { useState } from "react";

export default function UserSettings() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark", !darkMode);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold">User Settings</h3>
      <div className="flex items-center">
        <label htmlFor="darkMode" className="mr-2">Dark Mode</label>
        <input
          type="checkbox"
          id="darkMode"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>
    </div>
  );
}
