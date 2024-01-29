import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Draw from './components/Draw'; 
import Home from './components/Home'; 
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Draw width={600} height={400} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/draw" element={<Draw width={600} height={400} />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
