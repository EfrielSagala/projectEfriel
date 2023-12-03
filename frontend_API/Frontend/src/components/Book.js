import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './styles.css'
import Header from "./Header";

const Book = () => {
    const [book, setBook] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);

            const response = await fetch("http://localhost:8080/v1/book", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                navigate('/', { state: { error: `${errorData.message} Please Login` } });
                localStorage.removeItem("token");
            }

            const data = await response.json();
            setBook(data.data);
        } catch (error) {
            console.error("Fetch error:", error);
            // navigate('/', { state: { error: `${error}` } });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddBookClick = () => {
        
        navigate("/v1/book/add");
    };

    const handleUpdateBookClick = (id, title, author, release) => {
        navigate('/v1/book/update', {
            state: {
                id,
                title,
                author,
                release,
            }
        });
    }

    const handleDeleteBookClick = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/v1/book/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            // Update the book state by removing the deleted book
            setBook((prevBook) => prevBook.filter((buku) => buku.book_id !== id));

            console.log(`Book with ID ${id} deleted successfully`);
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    return (
      <div className="full-height  content-container" >
          <Header />
          <div className="container mt-4">
              <Button variant="success" onClick={handleAddBookClick}>Add Book</Button>
              <table className="table mt-4">
                  <thead>
                      <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Release</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {book.map((buku) => (
                          <tr key={buku.book_id}>
                              <td>{buku.book_title}</td>
                              <td>{buku.book_author}</td>
                              <td>{buku.book_release}</td>
                              <td>
                                  <Button variant="success" onClick={() => handleUpdateBookClick(buku.book_id, buku.book_title, buku.book_author, buku.book_release)}>Edit</Button>{' '}
                                  <Button variant="danger" onClick={() => handleDeleteBookClick(buku.book_id)}>Delete</Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default Book;
