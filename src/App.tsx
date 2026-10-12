import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { EngineProvider } from '@/context/EngineContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { ToastContainer } from '@/components/ToastContainer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Beranda } from '@/pages/Beranda';
import { Simulasi } from '@/pages/Simulasi';
import { KelolaDataset } from '@/pages/KelolaDataset';
import { AlurNLP } from '@/pages/AlurNLP';
import { Tentang } from '@/pages/Tentang';

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <AuthProvider>
      <EngineProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar onLoginClick={() => setLoginOpen(true)} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Beranda />} />
                <Route path="/simulasi" element={<Simulasi />} />
                <Route path="/dataset" element={<ProtectedRoute><KelolaDataset /></ProtectedRoute>} />
                <Route path="/alur" element={<AlurNLP />} />
                <Route path="/tentang" element={<Tentang />} />
              </Routes>
            </main>
            <Footer />
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </EngineProvider>
    </AuthProvider>
  );
}

export default App;
