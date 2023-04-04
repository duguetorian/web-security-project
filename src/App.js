import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import useAuthContext from './hooks/useAuthContext';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<PublicPage />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/logged' element={
          <RequireAuth>
            <LoggedIn />
          </RequireAuth>
        } />
        <Route path="*" element={<NTSH />} />
      </Routes>
      <Routes />
    </div>
  );
}

function LoggedIn() {
  let { user } = useAuthContext()
  return (
    <>
      <NavBar />
      <h1>LOGGED IN AS : {user}</h1>
    </>
  )
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
  let { user } = useAuthContext();
  if (!user) {
    return <Navigate replace to='/login' />;
  }
  return <>{children}</>
}

export default App;
