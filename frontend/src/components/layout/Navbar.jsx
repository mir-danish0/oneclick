import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { categories } from '../../data/tools';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggleTheme = () => {
    setDark(prev => !prev);
  };

  return (
    <nav className="site-navbar" style={{
      background: scrolled ? 'var(--color-bg-glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: '20px', height: '20px', color: 'var(--color-bg-primary)' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            One<span className="gradient-text">Click</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="nav-link"
              style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-secondary)', textDecoration: 'none', borderRadius: '8px', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >
              <span style={{ marginRight: '4px' }}>{cat.emoji}</span>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="mobile-menu-btn"
            style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'none' }}
            aria-label="Toggle menu"
          >
            {open ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ padding: '8px 16px 16px', background: 'var(--color-bg-glass)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border)' }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              style={{ display: 'block', padding: '12px 16px', fontSize: '14px', color: 'var(--color-text-secondary)', textDecoration: 'none', borderRadius: '8px' }}
            >
              <span style={{ marginRight: '8px' }}>{cat.emoji}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
