import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Book from './components/Book';
import Login from './components/Login';
import { BrowserRouter, Route, Routes, Router, Switch } from 'react-router-dom';
import AddBookForm from './components/AddBookForm';
import UpdateBookFrom from './components/UpdateBookFrom';






function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Login />} />
      <Route  path="/v1/book" element={<Book />} />
      <Route  path="/v1/book/add" element={<AddBookForm />} />
      <Route path='/v1/book/update' element={<UpdateBookFrom/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
