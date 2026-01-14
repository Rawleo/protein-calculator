import React from "react"
import { Link } from "gatsby"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>

            <main className="container mx-auto py-20 px-4 flex-grow flex flex-col items-center justify-center text-center">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Page Not Found</h2>
                <p className="text-lg text-gray-600 mb-10 max-w-md">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                <Link
                    to="/"
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1"
                >
                    Go Back Home
                </Link>
            </main>

            <footer className="pb-8 text-center text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} Protein Planner. Built for gains.</p>
            </footer>
        </div>
    )
}
