// components/Modal.js
import { useState } from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg">X</button>
        <div>{children}</div>
      </div>
    </div>
  );
}
