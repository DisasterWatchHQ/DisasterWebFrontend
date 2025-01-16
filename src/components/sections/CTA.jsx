import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Stay Prepared, stay Connected
        </h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Join our network of communities working together to enhance disaster
          preparedness and response.
        </p>
        <Button size="lg" variant="secondary">
          Get Started Now
        </Button>
      </div>
    </section>
  );
}
