import React from "react"
import ProteinCalculator from "../components/ProteinCalculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>

      <main className="container mx-auto py-12 px-4">
        <header className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
            Daily Protein Planner
          </h1>
          <p className="text-lg text-gray-500">
            Precision planning for your macros. Calculate exactly how much you need to eat to hit your goals efficiently.
          </p>
        </header>

        <ProteinCalculator />

        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Protein Planner. Built for gains.</p>
        </footer>
      </main>
    </div>
  )
}
