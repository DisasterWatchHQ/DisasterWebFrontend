import Header from "../components/Header";
import Footer from "../components/Footer";
import ReportCard from "../components/ReportCard";

export default function Feed(){
    const reports = [
        {
          title: "Flood Alert",
          description: "Flood reported in XYZ area. Evacuation recommended.",
          date: "2024-12-01T10:00:00Z",
          location: "XYZ City",
        },
        {
          title: "Earthquake Warning",
          description: "Possible aftershocks detected in ABC region.",
          date: "2024-12-02T08:00:00Z",
          location: "ABC Region",
        },
      ];
    
    
    return(
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Disaster Feed</h1>
                {reports.map((report,index)=>(
                    <ReportCard key={index} {...report} />
                ))}
            </main>
            <Footer/>
        </div>
    );
}