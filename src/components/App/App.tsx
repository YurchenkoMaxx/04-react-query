import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import { toast } from "react-hot-toast";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<
    { results: Movie[]; total_pages: number },
    Error
  >({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast("No movies found for your request.", {
        icon: "❌",
        duration: 3000,
        position: "top-center",
      });
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;

  const onSubmit = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={onSubmit} />
      {isSuccess && data?.results.length > 0 && (
        <Pagination
          page={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data.results} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
