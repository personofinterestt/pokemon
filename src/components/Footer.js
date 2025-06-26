export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 text-sm py-6 mt-12 font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} Alaaddin Ticaret. Tüm hakları saklıdır.</span>
        <span>Powered by <a href="https://alaaddinticaret.com" className="underline hover:text-neutral-200 transition">Alaaddin Ticaret</a></span>
      </div>
    </footer>
  );
} 