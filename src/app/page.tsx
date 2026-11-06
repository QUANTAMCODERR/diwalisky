import FireworksCanvas from "@/components/FireworksCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <FireworksCanvas />
      {/* Background Stars */}
      <div
        className="absolute inset-0 opacity-60
        bg-[radial-gradient(white_1px,transparent_1px)]
        [background-size:50px_50px]"
      />

      {/* Main Content */}
      <div
        className="relative z-10 flex min-h-screen
        flex-col items-center justify-center px-4 text-center"
      >
        <p
          className="mb-4 text-sm tracking-[0.4em]
          text-purple-400 uppercase"
        >
          Welcome to the sky
        </p>

        <h1
          className="text-5xl font-bold tracking-tight
          sm:text-7xl"
        >
          Blast<span className="text-purple-500">Sky</span>
        </h1>

        <p className="mt-5 max-w-md text-gray-400">
          Experience the magic of fireworks. Light up the night with your
          imagination.
        </p>

        <button
          className="mt-8 rounded-full bg-purple-600
          px-8 py-3 font-semibold transition-all
          hover:scale-105 hover:bg-purple-500"
        >
          Launch Fireworks
        </button>

        <p className="mt-5 text-xs text-gray-500">
          Click anywhere to create magic ✨
        </p>
      </div>
    </main>
  );
}
