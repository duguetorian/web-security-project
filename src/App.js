import { Routes, Route } from 'react-router';
import './App.css';
import AuthPage from './components/AuthPage';
import PostLoginTest from './components/PostLoginTest';

function App() {
  return (
    <div className="App">
      {/* <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/protected' element{
          <RequireAuth>
            <PostLoginTest />
          </RequireAuth>
        }
      </Routes> */}
      <AuthPage />
    </div>
  );
}

export default App;
