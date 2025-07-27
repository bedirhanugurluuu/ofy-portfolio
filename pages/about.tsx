// pages/about.tsx
import Link from 'next/link'

export default function About() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Hakkımızda
            </h1>
            <p className="max-w-2xl text-gray-600 mb-6 text-center">
                Burada firmanın ya da kişinin hakkında bilgileri yazabiliriz. 
                Örnek metinlerle tasarım yapabiliriz.
            </p>
            <Link href="/" legacyBehavior>
                <a className="px-6 py-3 bg-gray-300 rounded-md hover:bg-gray-400 transition">
                    Anasayfaya Dön
                </a>
            </Link>
        </div>
    )
}