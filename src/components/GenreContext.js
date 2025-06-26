import { createContext, useContext, useEffect, useState } from 'react';

const GenreContext = createContext();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function GenreProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=tr', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const genresWithSlug = (data.genres || []).map(g => ({ ...g, slug: slugify(g.name) }));
        setGenres(genresWithSlug);
      } catch (err) {
        setError('API error');
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <GenreContext.Provider value={{ genres, loading, error }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
} 