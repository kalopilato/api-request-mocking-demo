import { useState } from "react";
import { useMutation, useQuery, queryCache } from "react-query";
import axios from "axios";

import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const {
    searchResults,
    searchStatus,
    searchError,
    search,
  } = useDocumentSearch(searchText);

  const { readingList } = useReadingList();

  function handleSearch(e) {
    e.preventDefault();
    search();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-heading">API Request Mocking Demo</h1>
      </header>
      <main>
        <div className="App-description">
          <p>
            This is a demo application to accompany the blog post:{" "}
            <a href="https://www.kalopilato.com">
              Mocking API Requests For Testing And Development Using Mock
              Service Workers
            </a>
          </p>
          <p>
            Live data is sourced from the{" "}
            <a href="https://openlibrary.org/dev/docs/api/search">
              Open Library Search API
            </a>
          </p>
        </div>
        <h2 className="App-search-heading">Open Library Document Search</h2>
        <form onSubmit={handleSearch} className="App-search-form">
          <label htmlFor="search-field" hidden>
            Search
          </label>
          <input
            id="search-field"
            className="App-search-input"
            placeholder="e.g. the lord of the rings"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="App-search-button"
            type="submit"
            disabled={searchStatus === "loading" || !searchText.length}
          >
            Search
          </button>
        </form>
        <div className="App-search-results-container">
          {searchStatus === "loading" ? <span>Loading...</span> : null}
          {searchStatus === "error" ? (
            <span>{`Something went wrong: ${searchError.response.data.message}`}</span>
          ) : null}
          {searchResults ? (
            <ul>
              {searchResults.docs.map((document) => (
                <DocumentSearchResult
                  key={document.key}
                  document={document}
                  isOnReadingList={
                    readingList?.works.includes(document.key) ?? false
                  }
                />
              ))}
            </ul>
          ) : null}
        </div>
      </main>
      <footer className="App-footer">
        <p>
          Blog Article:{" "}
          <a href="https://www.kalopilato.com">
            API Request Mocking With Mock Service Workers
          </a>
        </p>
        <p>
          Data API:{" "}
          <a href="https://openlibrary.org/dev/docs/api/search">
            Open Library Search API
          </a>
        </p>
      </footer>
    </div>
  );
}

function DocumentSearchResult({ document, isOnReadingList = false }) {
  const [addToReadingList, { status }] = useMutation(
    (workId) =>
      axios.post("https://openlibrary.org/reading_list/add", { workId }),
    {
      onSuccess: () => queryCache.invalidateQueries("readingList"),
    }
  );

  return (
    <li key={document.key} className="DocumentSearchResult-item">
      <div className="DocumentSearchResult-image-container">
        {document.isbn?.length ? (
          <img
            alt={document.title}
            src={`http://covers.openlibrary.org/b/isbn/${document.isbn[0]}-S.jpg`}
          />
        ) : null}
      </div>
      <div>
        <p>{`${document.title} by ${document.author_name}`}</p>
        <p>{`First published: ${document.first_publish_year}`}</p>
        <p>Mocked store link: {document.store_link}</p>
        {isOnReadingList ? (
          <p>Added to mocked reading list!</p>
        ) : (
          <button
            type="button"
            onClick={() => addToReadingList(document.key)}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Adding..." : "Add to reading list"}
          </button>
        )}
      </div>
    </li>
  );
}

function useDocumentSearch(searchText) {
  const {
    data: searchResults,
    status: searchStatus,
    error: searchError,
    refetch: search,
  } = useQuery(
    ["documents", { searchText }],
    (_, { searchText }) => {
      return axios
        .get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            searchText
          )}`
        )
        .then(({ data }) => data);
    },
    {
      enabled: false,
      retry: false,
    }
  );

  return { searchResults, searchStatus, searchError, search };
}

const useReadingList = () => {
  const {
    data: readingList,
    status: readingListStatus,
    error: readingListError,
    refetch: fetchReadingList,
  } = useQuery(["readingList"], () => {
    return axios
      .get(`https://openlibrary.org/reading_list`)
      .then(({ data }) => data);
  });

  return { readingList, readingListStatus, readingListError, fetchReadingList };
};

export default App;
