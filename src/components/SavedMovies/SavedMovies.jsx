import React, {useContext, useEffect, useState} from 'react';
import './SavedMovies.css'
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";
import {filterMovies, filterShortMovies} from "../../utils/utils";


function SavedMovies({savedMoviesList, handleSaveMovie, handleDeleteMovie}) {
  const currentUser = useContext(CurrentUserContext)
  const [checkboxShortMovies, setCheckboxShortMovies] = useState(false)
  const [notFoundMovies, setNotFoundMovies] = useState(false)
  const [filteredMovies, setFilteredMovies] = useState([])
  const [visibleMovies, setVisibleMovies] = useState(savedMoviesList)

  const handleSearchText = (value) => {
    const moviesList = filterMovies(savedMoviesList, value, checkboxShortMovies)
    if (moviesList.length === 0) {
      setNotFoundMovies(true)
    } else {
      setNotFoundMovies(false)
      setFilteredMovies(moviesList)
      setVisibleMovies(moviesList)
    }
  }

  const handleCheckboxShortMovies = () => {
    if (!checkboxShortMovies) {
      setCheckboxShortMovies(true);
      localStorage.setItem(`${currentUser.email}_savedShortMovies`, true);
      setVisibleMovies(filterShortMovies(filteredMovies))
      setNotFoundMovies(filterShortMovies(filteredMovies).length === 0)
    } else {
      setCheckboxShortMovies(false);
      localStorage.setItem(`${currentUser.email}_savedShortMovies`, false);
      setVisibleMovies(filteredMovies)
      setNotFoundMovies(filterShortMovies(filteredMovies).length === 0)
    }
  }

  const checkCheckboxShortMovies = () => {
    if (localStorage.getItem(`${currentUser.email}_savedShortMovies`) === 'true') {
      setCheckboxShortMovies(true)
      setVisibleMovies(filterShortMovies(savedMoviesList))
    } else {
      setCheckboxShortMovies(false)
      setVisibleMovies(savedMoviesList)
    }
  }

  useEffect(checkCheckboxShortMovies, [savedMoviesList, currentUser])

  useEffect(() => {
    if (savedMoviesList) {
      setFilteredMovies(savedMoviesList)
      setNotFoundMovies(savedMoviesList.length === 0)
    }
  }, [savedMoviesList])

  return (
    <section className={'saved-movies'}>
      <SearchForm handleSearchText={handleSearchText}
                  handleCheckboxShortMovies={handleCheckboxShortMovies}
                  checkboxShortMovies={checkboxShortMovies}
      />
      {notFoundMovies &&
        <div className={'movies__error'}>Ничего не найдено</div>}
      {!notFoundMovies && <MoviesCardList movies={visibleMovies}
                       savedMoviesList={savedMoviesList}
                       handleSaveMovie={handleSaveMovie}
                       handleDeleteMovie={handleDeleteMovie}
      />}
    </section>
  );
}

export default SavedMovies;
