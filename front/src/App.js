import "./App.css";
import React from "react";

function App() {
  const apiUrl = "https://node-db-books.vercel.app/book";
  const [books, setBooks] = React.useState();

  React.useEffect(() => {
    fetch(apiUrl)
      .then((books) => books.json())
      .then((booksParsed) => setBooks(booksParsed));
  }, []);

  return (
    <div className="App">
      <h2>Libros:</h2>
      <ul>
        {books?.data?.map((book) => (
          <li>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
