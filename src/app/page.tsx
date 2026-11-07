
import FireworksCanvas from "@/components/FireworksCanvas";

export default function Home() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#030712] text-white">

      {/* Background Stars */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40
        bg-[radial-gradient(white_1px,transparent_1px)]
        [background-size:65px_65px]"
      />

      {/* Fireworks Canvas */}
      <FireworksCanvas />

      {/* Header */}
      <header className="pointer-events-none absolute left-0 top-0 z-20 w-full px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Blast<span className="text-purple-500">Sky</span>
          </h1>
        </div>
      </header>

      {/* Bottom Instructions */}
      <div className="pointer-events-none absolute bottom-8 left-0 z-20 w-full px-4 text-center">
        <p className="text-sm text-gray-400 sm:text-base">
          ✨ Click or tap anywhere to launch fireworks
        </p>

        <p className="mt-2 text-xs text-gray-600">
          Made with Next.js & HTML Canvas
        </p>
      </div>

    </main>
  );
}
