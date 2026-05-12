import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import FileConverterPage from './pages/tools/FileConverterPage';
import ImageConverterPage from './pages/tools/ImageConverterPage';
import PdfToolsPage from './pages/tools/PdfToolsPage';
import SocialDownloaderPage from './pages/tools/SocialDownloaderPage';
import LinkToolsPage from './pages/tools/LinkToolsPage';
import TextToolsPage from './pages/tools/TextToolsPage';
import { getToolById } from './data/tools';

/* Route each tool to the correct page component based on category */
function ToolRouter() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  if (!tool) return <FileConverterPage />;

  switch (tool.category) {
    case 'file-converter': return <FileConverterPage />;
    case 'image-converter': return <ImageConverterPage />;
    case 'pdf-tools': return <PdfToolsPage />;
    case 'social-downloader': return <SocialDownloaderPage />;
    case 'link-tools': return <LinkToolsPage />;
    case 'text-tools': return <TextToolsPage />;
    default: return <FileConverterPage />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#f0f0ff',
            border: '1px solid #1e1e32',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00ff88', secondary: '#0a0a0f' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' },
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/tool/:toolId" element={<ToolRouter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
