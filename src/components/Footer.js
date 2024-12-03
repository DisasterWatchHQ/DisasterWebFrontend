// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>&copy; 2024 DisasterWatch. All rights reserved.</p>
      <p>
        <a href="/contact" className="hover:underline">Contact Us</a> | 
        <a href="/about" className="hover:underline"> About</a>
      </p>
    </footer>
  );
}
