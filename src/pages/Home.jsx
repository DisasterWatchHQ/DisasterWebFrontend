import Card from "../components/Card";

const Home = () => {
  const features = [
    { title: "Alerts", description: "Real-time disaster alerts." },
    { title: "Reports", description: "Submit and view disaster reports." },
    { title: "Resources", description: "Access emergency resources." },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Disaster Watch</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
