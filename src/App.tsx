import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { VisualizePage } from './pages/VisualizePage';
import { AboutPage } from './pages/AboutPage';
import { SEOPage } from './pages/SEOPage';
import { siteConfig } from './config/siteConfig';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/about" element={<AboutPage />} />
            {siteConfig.seoPages.map((page) => (
              <Route
                key={page.slug}
                path={`/${page.slug}`}
                element={<SEOPage config={page} />}
              />
            ))}
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
