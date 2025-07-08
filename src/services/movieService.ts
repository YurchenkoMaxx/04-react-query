import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`;

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
    },
    headers: {
      Authorization: API_TOKEN,
    },
  });

  return response.data.results;
};
