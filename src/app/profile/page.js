
"use client"; 

import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user from localStorage if available
    } else {
      setUser({ name: 'Anonymous', email: '' }); // Set Anonymous if no user is logged in
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Name:</strong> {user ? user.name : 'Anonymous'}</p>
        <p><strong>Email:</strong> {user ? user.email : 'Not available'}</p>
      </div>
    </div>
  );
}
