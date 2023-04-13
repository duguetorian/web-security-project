import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import useAuthToken from './hooks/useAuthToken';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import ArticlePage from './components/ArticlePage';
import HomePage from './components/HomePage';
// import { Input } from 'semantic-ui-react';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<PublicPage />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/logged' element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        } />
        <Route path='/article/:uuid' element={
          <RequireAuth>
            <ArticlePage />
          </RequireAuth>
        } />
        <Route path="*" element={<NTSH />} />
      </Routes>
      <Routes />
    </div>
  );
}

function PublicPage() {
  return (
    <div>
      <h1>Welcome to Ducking RSS</h1>
      <Link to="/logged">Login</Link>
    </div>
  )
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
  return <>
    <NavBar>
      {children}
    </NavBar>
  </>
}

export default App;
