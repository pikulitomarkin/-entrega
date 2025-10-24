import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Deliveries from './pages/Deliveries';
import WhatsApp from './pages/WhatsApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="whatsapp" element={<WhatsApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
