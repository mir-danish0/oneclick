import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';
import { categories } from '../../data/tools';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1e1e32', background: '#0a0a0f', position: 'relative' }}>
      {/* Gradient line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00d4ff33, transparent)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: '16px', height: '16px', color: '#0a0a0f' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#fff' }}>
                One<span className="gradient-text">Click</span>
              </span>
            </Link>
            <p style={{ fontSize: '14px', color: '#8888aa', lineHeight: '1.7', maxWidth: '280px' }}>
              All your file, PDF, image, and link tools in one place. Free, fast, and browser-based.
            </p>
          </div>

          {/* Tool Categories */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '16px', fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tool Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.id}`} style={{ fontSize: '14px', color: '#8888aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => e.target.style.color = '#00d4ff'} onMouseLeave={e => e.target.style.color = '#8888aa'}>
                  <span>{cat.emoji}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '16px', fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(link => (
                <a key={link} href="#" style={{ fontSize: '14px', color: '#8888aa', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#00d4ff'} onMouseLeave={e => e.target.style.color = '#8888aa'}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '16px', fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Resources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Blog', 'API Documentation', 'Changelog', 'Status Page'].map(link => (
                <a key={link} href="#" style={{ fontSize: '14px', color: '#8888aa', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#00d4ff'} onMouseLeave={e => e.target.style.color = '#8888aa'}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1e1e32', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: '#4a4a6a' }}>
            © {new Date().getFullYear()} OneClick. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#4a4a6a' }}>
            Made with <Heart style={{ width: '14px', height: '14px', color: '#f43f5e', margin: '0 4px' }} /> by OneClick Team
          </div>
        </div>
      </div>
    </footer>
  );
}
