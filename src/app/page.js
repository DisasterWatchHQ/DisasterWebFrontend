import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {/* Main Content */}
      <main className="row-start-2 flex flex-col gap-8 w-full items-center sm:items-start">
        <section className="text-center sm:text-left">
          <h2 className="text-lg font-bold mb-4">Stay Updated</h2>
          <p>
            Get real-time updates on disasters in your area. View emergency
            hotlines, disaster feeds, and guides to stay prepared.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/map"
            className="rounded border border-gray-300 hover:border-gray-400 px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            View Map
          </a>
          <a
            href="/feed"
            className="rounded border border-gray-300 hover:border-gray-400 px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            View Reports
          </a>
          <a
            href="/resources"
            className="rounded border border-gray-300 hover:border-gray-400 px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            Emergency Resources
          </a>
        </div>
      </main>

    </div>
  );
}
