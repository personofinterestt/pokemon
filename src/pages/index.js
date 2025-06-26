import Image from "next/image"; // Bu import kullanmıyorsanız kaldırabilirsiniz
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { getPokemons } from './api/apiDocs';


// Font tanımlamaları
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  // router.query.page bu kodu kullanmıyorsanız bu satırı kaldırabilirsiniz.
  // const page = parseInt(router.query.page) || 1;

  // Orijinal pokemon listesini saklamak için state
  const [allPokemons, setAllPokemons] = useState([]);
  // Ekranda gösterilecek (filtrelenmiş veya filtrelenmemiş) pokemonlar için state
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Hata yönetimi için state
  const [search, setSearch] = useState("");



  useEffect(() => {
    getPokemons({limit: 160}).then(data => {
      setDisplayedPokemons(data.results);
      setAllPokemons(data.results);
      setLoading(false);
    });
  },[]);
  // Arama input'u değiştiğinde çalışacak useEffect
  useEffect(() => {
    if (search) {
      // Orijinal listeden (allPokemons) filtrele
      const filtered = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()) // Küçük harfe çevirerek karşılaştır
      );
      setDisplayedPokemons(filtered); // Filtrelenmiş listeyi ekrana göster
    } else {
      // Arama alanı boş olduğunda orijinal listeyi göster
      setDisplayedPokemons(allPokemons);
    }
  }, [search, allPokemons]); // search ve allPokemons değiştiğinde tetiklensin

  return (
    // Eğer Redux'u sadece burada kullanmıyorsanız, Provider'ı _app.js veya layout dosyanızda kullanmak daha iyidir.
    // <Provider store={store}>
      <div
        className={`min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 p-4 sm:p-6 ${geistSans.variable} font-sans`}
      >
    <div className="flex flex-col sm:flex-row justify-center items-center mb-6 px-4"> {/* Container'a padding ekledik */}
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Pokemon Ara..."
    className="w-full max-w-md p-3 rounded-lg border-2 border-yellow-300 text-center text-white placeholder-yellow-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
  />
</div>

        {loading && <p className="text-center text-white">Yükleniyor...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && displayedPokemons.length === 0 && search && (
            <p className="text-center text-white">Aradığınız isimde Pokemon bulunamadı.</p>
        )}
         {!loading && !error && displayedPokemons.length === 0 && !search && (
            <p className="text-center text-white">Gösterilecek Pokemon bulunamadı.</p>
        )}

<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3"> {/* Daha fazla sütun ve daha dar aralık */}
  {!loading && !error && displayedPokemons.map((pokemon) => (
    // Ana kart container: Sade görünüm, toprak rengi, keskin kenarlar, küçük padding
    <div
      key={pokemon.name}
      className="bg-yellow-100 border-2 border-yellow-300 shadow-md flex flex-col items-center p-2 rounded-sm"
    >
      <img
        className="w-full h-32 object-contain mb-2 rounded-sm" // Resim boyutu küçültüldü, kenarlar keskinleştirildi
        src={pokemon.sprites?.other?.['official-artwork']?.front_default || `https://img.pokemondb.net/artwork/${pokemon.name}.jpg`}
        alt={`Resim ${pokemon.name}`}
      />
      <div className="text-center w-full px-1"> {/* Metin için biraz yatay padding */}
        <Link href={`/pokemon/${pokemon.name}`}>
          {/* Metin stili: Küçük font, bold, gri renk, isim kısaltılabilir */}
          <div className="text-sm font-bold text-gray-800 cursor-pointer truncate hover:text-blue-700 transition duration-200">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </div>
        </Link>
      </div>
    </div>
  ))}
</div>
      </div>
    // </Provider>
  );
}