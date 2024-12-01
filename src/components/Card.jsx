const Card = ({ title, description }) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;
