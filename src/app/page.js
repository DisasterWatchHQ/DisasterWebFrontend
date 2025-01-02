import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import RecentUpdates from "@/components/sections/RecentUpdates";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <RecentUpdates />
      <CTA />
    </div>
  );
}
