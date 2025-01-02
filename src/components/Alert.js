// components/Alert.js
export default function Alert({ message, type = "info" }) {
  const bgColor =
    type === "info"
      ? "bg-blue-500"
      : type === "warning"
        ? "bg-yellow-500"
        : "bg-red-500";
  return (
    <div className={`text-white p-4 rounded ${bgColor}`}>
      <strong>{message}</strong>
    </div>
  );
}
