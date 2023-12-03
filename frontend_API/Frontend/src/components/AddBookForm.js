import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import './styles.css'; // Import the CSS file
import { useNavigate, useLocation} from 'react-router-dom';

const add = async (title, author, release,) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    const response = await fetch("http://localhost:8080/v1/book", {
      method: "POST",
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

const AddBookForm = () => {
  const [title, settitle] = useState("");
  const [author, setauthor] = useState("");
  const [release, setrelease] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleTokenCheck = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/', { state: { error: 'Not authorized. Please Login.' } });
    }
  };

  useEffect(() => {
    handleTokenCheck();
  });

  const handleAdd = async () => {
    try {
      const response = await add(title, author, release);

      if (response.ok) {
        alert('Book successfully added');
        navigate('/v1/book')
      } else if (response.status === 400) {
        alert('Failed to add data. Check the fields and make sure none are empty.');
      } else {
        const errorData = await response.json();
        navigate('/', { state: { error: `${errorData.messauthor} Please Login` } });
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
          margin: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          marginTop: '50px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3 className="text-center mb-4">Add Book Data</h3>
        <Form.Group className="mb-3" controlId="formtitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            title="title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formauthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author"
            title="author"
            value={author}
            onChange={(e) => setauthor(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formrelease">
          <Form.Label>Release</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter release"
            title="release"
            value={release}
            onChange={(e) => setrelease(e.target.value)}
            required
          />
        </Form.Group>

        <Button className='bg-success' onClick={handleAdd}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddBookForm;
