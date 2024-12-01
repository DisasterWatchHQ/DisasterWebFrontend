const Alerts = () => {
  const alerts = [
    { title: "Flood Alert", description: "Heavy rain expected in the next 24 hours." },
    { title: "Earthquake Warning", description: "Tremors detected nearby." },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="grid gap-4 mt-4">
        {alerts.map((alert, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="font-bold">{alert.title}</h3>
            <p>{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
