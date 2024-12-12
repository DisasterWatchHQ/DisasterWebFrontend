import { Button } from "@/components/ui/button";

export default function Hero(){
    return(
        <section className="relative bg-gray-900 text-white py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6"> 
                        Stay Informed, Stay Safe
                    </h1>
                    <p className="text-xl mb-8 text-gray-300">
                        Real-time disaster monitoring and emergency resources to keep you and your community prepared.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            View Live Map
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                            Emergency Resources
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}