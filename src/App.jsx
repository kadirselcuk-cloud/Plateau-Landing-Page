import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';

function HashScroller() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/Plateau-Landing-Page">
      <HashScroller />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studio" element={<ProductPage slug="studio" />} />
        <Route path="/workflow" element={<ProductPage slug="workflow" />} />
        <Route path="/superapp" element={<ProductPage slug="superapp" />} />
        <Route path="/security" element={<ProductPage slug="security" />} />
        <Route path="/framework" element={<ProductPage slug="framework" />} />
        <Route path="/services" element={<ProductPage slug="services" />} />
      </Routes>
    </BrowserRouter>
  );
}
