import Card from "../components/Card";

const Home = () => {
  const cards = [
    { title: "Alerts", description: "View real-time disaster alerts" },
    { title: "Reports", description: "Submit or view disaster reports" },
    { title: "Resources", description: "Find emergency resources" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Disaster Watch</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Home;
