
export default function Feed(){
    return(
        <div>
            <Header/>
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Disaster Feed</h1>
                {ReportingObserver.map((report,index)=>(
                    <ReportCard key={index} {...report} />
                ))}
            </main>
            <Footer/>
        </div>
    );
}