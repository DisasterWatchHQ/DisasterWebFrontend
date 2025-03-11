import LandingPage from "@/components/common/LandingPage";

export const metadata = {
  title: 'Home | Disaster Web App',
  description: 'Welcome to the Disaster Web App home page',
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <LandingPage />
    </div>
  );
}
