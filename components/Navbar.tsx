import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white">
      <Link href="/" className="text-xl font-bold tracking-tight text-indigo-400">
        BioStudio
      </Link>
      <div className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <Link 
          href="/editor" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Open Studio Editor
        </Link>
      </div>
    </nav>
  );
}
