import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<div>Dashboard</div>} />
          <Route path="/tasks" element={<div>Tasks</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;