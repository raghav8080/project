import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SendEmail from './components/SendEmail';
import ReceiveEmail from './components/ReceiveEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SendEmail />} />
        <Route path="/receive" element={<ReceiveEmail />} />
      </Routes>
    </Router>
  );
}

export default App;