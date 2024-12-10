import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function Guides() {
  const guides=[
    {category:"Flood",info:"Stay on high ground and avoid floodwater."},
    {category:"Earthquake",info:"Duck, cover, and hold during tremors."},
    {category:"Fire",info:"Evacuate immediately; use wet cloth to breathe."},
  ];
  
    return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Disaster Preparedness Guides</h1>
            <ul className="space-y-4">
              {guides.map((guide, index) => (
                <li key={index} className="bg-white p-4 rounded shadow">
                  <h2 className="font-bold">{guide.category}</h2>
                  <p>{guide.info}</p>
                </li>
              ))}
            </ul>
          </main>
        </div>
      );
}