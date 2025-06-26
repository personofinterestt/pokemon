import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-neutral-900/95 border-b border-neutral-800 shadow-lg backdrop-blur font-['Montserrat']">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      
        <div className="text-2xl font-extrabold text-neutral-100 tracking-tight cursor-pointer">
          <Link href="/">
            <span>Pokémon</span>
          </Link>
        </div>
      </div>
    </header>
  );
} 