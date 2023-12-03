import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import './styles.css'
import { useNavigate, useLocation } from 'react-router-dom';

const update = async (id, title, author, release,) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const response = await fetch(`http://localhost:8080/v1/book/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          book_title: title,
          book_author: author,
          book_release: release,
         
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
const UpdateBooktFrom= () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [release, setRelease] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleTokenCheck = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect ke halaman login jika token tidak ada
      navigate('/', { state: { error: 'not authorized Please Login' } });
    }
  };

  useEffect(() => {
    handleTokenCheck();
  }, );

  // Setel nilai awal formulir menggunakan data dari state lokasi
  useEffect(() => {
    if (state) {
      setTitle(state.title || "");
      setAuthor(state.author || "");
      setRelease(state.release || "");
    
    }
  }, [state]);

  const handleUpdate = async () => {
    const id = state.id
    try {
      const response = await update(id, title, author, release);

      if (response.ok) {
        // Add Success
        alert('Data Berhasil DiUpdate');
        navigate('/v1/book');
      } else if (response.status === 400) {
        // Unauthorized, token tidak valid
        alert('Data Gagal DiUpdate,Periksa Kolom Jangan Ada Yang Kosong');
      } else {
        const errorData = await response.json();
        navigate('/', { state: { error: `${errorData.message} Please Login` } });
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <Header />
      <Form
        style={{
          width: '50%',
          backgroundColor:'white',
          margin: 'auto',
          marginTop: '50px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-center">Update Book Data</h3>
        <Form.Group classTitle="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRelease">
          <Form.Label>Release</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Release"
            name="release"
            value={release}
            onChange={(e) => setRelease(e.target.value)}
            required
          />
        </Form.Group>

        

        <Button variant="primary" onClick={handleUpdate}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UpdateBooktFrom;