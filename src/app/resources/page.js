
export default function Resources(){
    const resources = [
        {title: 'Emergency Contacts', link:'#emergency-contacts'},
      
    ];

    return (
        <div className="p-6">
            <h1 className="text-2x1 font-bold mb-4">Resources</h1>
            <ul className="space-y-2">
                {resources.map((resource, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded shadow">
                        <a href={resource.link} className="text-vlue-500 hover:underline">
                            {resource.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}