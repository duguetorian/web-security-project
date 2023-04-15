import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import useAuthToken from './hooks/useAuthToken';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import { SourceIdProvider } from './context/SourceIdContext';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate replace to='/home' />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/home' element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        } />
        <Route path="*" element={<NTSH />} />
      </Routes>
      <Routes />
    </div>
  );
}

function NTSH() {
  return (
    <div>
      <h1>You're lost there is nothing to see here</h1>
      <Link to="/">Go back Home</Link>
    </div>
  )
}

function RequireAuth({ children }) {
  let { authToken } = useAuthToken();
  if (!authToken || !authToken.user) {
    return <Navigate replace to='/login' />;
  }
  return <SourceIdProvider>
    <NavBar>
      {children}
    </NavBar>
  </SourceIdProvider>
}

export default App;
