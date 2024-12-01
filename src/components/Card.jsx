import { cn } from "../lib/utils";

const Card = ({ title, description, className }) => {
  return (
    <div
      className={cn(
        "border rounded-md p-4 shadow hover:shadow-lg transition",
        className
      )}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default Card;
