import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`;

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<FetchMoviesResponse> => {
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: API_TOKEN,
    },
  });

  return {
    results: response.data.results ?? [],
    total_pages: response.data.total_pages ?? 0,
  };
};
