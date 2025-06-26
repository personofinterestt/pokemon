import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPokemonDetail } from '../api/apiDocs';


// Resim verisini işleyen yardımcı fonksiyon
function extractPokemonImages(pokemonData) {
  const images = [];
  if (!pokemonData || !pokemonData.sprites) return images;

  const sprites = pokemonData.sprites;

  // "Official Artwork" ve "Dream World" gibi popüler olanları önce ekleyelim
  if (sprites.other?.['official-artwork']?.front_default) {
    images.push({
      name: "Official Artwork",
      url: sprites.other['official-artwork'].front_default,
      type: "official-artwork"
    });
  }
  if (sprites.other?.['dream-world']?.front_default) {
    images.push({
      name: "Dream World",
      url: sprites.other['dream-world'].front_default,
      type: "dream-world"
    });
  }
    if (sprites.front_default) {
    images.push({
      name: "Front Default",
      url: sprites.front_default,
      type: "front-default"
    });
  }
  if (sprites.back_default) {
    images.push({
      name: "Back Default",
      url: sprites.back_default,
      type: "back-default"
    });
  }
  if (sprites.front_shiny) {
    images.push({
      name: "Front Shiny",
      url: sprites.front_shiny,
      type: "front-shiny"
    });
  }
    if (sprites.back_shiny) {
    images.push({
      name: "Back Shiny",
      url: sprites.back_shiny,
      type: "back-shiny"
    });
  }


  // Generation-specific resimleri de ekleyelim
  for (const genName in sprites.versions) {
    for (const versionType in sprites.versions[genName]) {
      const version = sprites.versions[genName][versionType];

      // Bazı versiyon tiplerinde (örn. diamond-pearl) female/shiny alanları olabilir, bunları da ekleyebiliriz.
      // Ancak burada sade olması için sadece front_default gibi olanları alalım.
      if (version.front_default) {
        images.push({
          name: `${genName.replace('-', ' ')} ${versionType.replace('-', ' ')}`,
          url: version.front_default,
          type: `${genName}-${versionType}-front-default`
        });
      }
       if (version.front_shiny) {
        images.push({
          name: `${genName.replace('-', ' ')} ${versionType.replace('-', ' ')} (Shiny)`,
          url: version.front_shiny,
          type: `${genName}-${versionType}-front-shiny`
        });
      }
      if (version.animated?.front_default) { // Animated GIF'leri de ekleyelim
         images.push({
          name: `${genName.replace('-', ' ')} ${versionType.replace('-', ' ')} (Animated)`,
          url: version.animated.front_default,
          type: `${genName}-${versionType}-animated`
        });
      }
      // Diğer resim türlerini de (back_default, front_transparent vb.) benzer şekilde ekleyebilirsiniz.
    }
  }

  // Tekrarlayan URL'leri kaldırmak için Set kullanabiliriz
  const uniqueImages = [];
  const seenUrls = new Set();
  for (const img of images) {
    if (!seenUrls.has(img.url)) {
      uniqueImages.push(img);
      seenUrls.add(img.url);
    }
  }

  return uniqueImages;
}


export default function pokemonDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [pokemon, setpokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Şu an gösterilen büyük resmi tutar

  useEffect(() => {
    getPokemonDetail(slug).then(data => {

      setpokemon(data);
      setLoading(false);
      setError(null);
    });
  }, [slug]);

  const allImages = pokemon ? extractPokemonImages(pokemon) : [];

  // Eğer seçili resim yoksa ve en az bir resim varsa, ilkini otomatik seç
  useEffect(() => {
    if (!selectedImage && allImages.length > 0) {
      setSelectedImage(allImages[0]);
    }
  }, [allImages, selectedImage]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 text-xl font-bold animate-pulse" style={{ fontFamily: 'Montserrat, sans-serif' }}>Yükleniyor...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-red-300 text-lg font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{error}</div>;
  }
  if (!pokemon) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 p-4 sm:p-8 flex justify-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="max-w-5xl w-full bg-neutral-900/95 rounded-3xl shadow-2xl border border-neutral-700 mx-auto flex flex-col md:flex-row overflow-hidden">
        {/* Sol Tarafta Büyük Resim */}
        <div className="md:w-1/2 flex items-center justify-center bg-neutral-800 p-6">
          <img
            src={selectedImage?.url || '/no_photo.png'} // Seçili resmi göster
            alt={selectedImage?.name || pokemon.name}
            className="w-full h-96 object-contain rounded-2xl shadow-lg bg-white"
          />
        </div>

        {/* Sağ Tarafta Pokemon Detayları ve Küçük Resim Listesi */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          {/* Temel Bilgiler */}
          <div className="flex flex-col gap-2">
          
            <h1 className="text-2xl font-extrabold text-neutral-100 mb-2 leading-tight">
              {pokemon.name ? (pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)) : 'İsim Yok'}
            </h1>
            <div className="text-neutral-50 font-extrabold text-3xl mb-2 flex items-center gap-1">
              <span>{pokemon.base_experience || '?'}</span> {/* PokeAPI için base_experience uygun olabilir */}
              <span className="text-lg font-semibold"> EXP</span>
            </div>
             {/* Eğer başka detaylar varsa buraya ekleyin */}
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-bold text-neutral-200 mb-3">Görseller</h2>
            <div className="flex flex-wrap gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800 pr-2">
              {allImages.map((img) => (
                <div
                  key={img.url}
                  className={`cursor-pointer p-1 rounded-md border-2 transition-all duration-200 ${
                    selectedImage?.url === img.url ? 'border-blue-500 bg-blue-500/20 shadow-md' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  {/* Küçük resim kartı için temsili bir küçük görsel */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-16 h-16 object-contain rounded-sm"
                    // onerror={(e) => e.target.style.display = 'none'} // Hatalı resimler için
                  />
                  {/* İsteğe bağlı olarak görselin adını da gösterebilirsiniz */}
                  {/* <p className="text-xs text-center text-neutral-400 mt-1">{img.name.substring(0, 10)}...</p> */}
                </div>
              ))}
            </div>
          </div>

          {/* DİĞER DETAYLAR VEYA SEPET BUTONU (GEREKİRSE) */}
          {/* Bu kısımları Pokemon'un API yapısına göre doldurun */}
          {/*
          <div className="text-neutral-300 text-base mt-2" dangerouslySetInnerHTML={{ __html: pokemon.description }} />
          <button
            className="w-full mt-4 py-3 rounded-xl bg-neutral-800 text-neutral-100 font-bold text-lg shadow hover:bg-black transition-colors disabled:bg-neutral-700 disabled:text-neutral-400"
            disabled={pokemon.stock === 0 || pokemon.stock === undefined}
          >
            Sepete Ekle
          </button>
          */}
           <div className="flex-1" /> {/* Bu, içerik az olduğunda butonu aşağı itmek içindir */}

        </div>
      </div>
    </div>
  );
} 