import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const Books = () => {
  // State to store the list of books
  const [books, setBooks] = useState([]);
  // useEffect hook is used for handling side effects in a functional component
  useEffect(() => {
    // Function to fetch all books when the component is mounted
    const fetchAllBooks = async () => {
      try {
        // Making an HTTP GET request to fetch the list of books from the server
        const res = await Axios.get("http://localhost:3002/books");
        // Updating the 'books' state with the data received from the server
        setBooks(res.data);
      } catch (err) {
        // Handling errors by logging them to the console
        console.log(err);
      }
    };
    // Calling the fetchAllBooks function when the component is mounted
    fetchAllBooks();
  }, []); // The empty dependency array means this effect runs once after the initial render

  const handleDelete = async (id) => {
    try {
      await Axios.delete("http://localhost:3002/books/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // The component's JSX (what gets rendered to the screen)
  return (
    <div>
      <h1 className="header-main">Books Management System</h1>
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && (
              <img
                src={encodeURI(`http://localhost:3002/images/${book.cover}`)}
                alt=""
              />
            )}
            <h2>{book.title}</h2>
            <p>{book.descr}</p>
            <span>₹ {book.price}</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>
              Delete
            </button>
            <button className="ubtn">
              <Link className="updatebtn" to={`/Update/${book.id}`}>
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>
      <button className="abtn">
        <Link className="addbtn" to="/Add">
          Add new Book
        </Link>
      </button>
    </div>
  );
};
export default Books;
