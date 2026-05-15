import { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';
import { tools, categories, searchTools } from '../data/tools';

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    let result = searchTools(query);
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    return result;
  }, [query, activeCategory]);

  return (
    <div>
      {/* ========= HERO ========= */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 60px', textAlign: 'center' }}>
        {/* Radial gradient blobs */}
        <div style={{ position: 'absolute', top: '-100px', left: '20%', width: '500px', height: '500px', background: '#00d4ff', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.07, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50px', right: '20%', width: '400px', height: '400px', background: '#7c3aed', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.05, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '50%', width: '300px', height: '300px', background: '#00ff88', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.04, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', background: 'var(--color-accent-blue-10)', border: '1px solid var(--color-accent-blue-20)', marginBottom: '24px' }}>
            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--color-accent-blue)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              30+ Free Online Tools
            </span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '24px', color: 'var(--color-text-primary)' }}>
            All Your File Tools.{' '}
            <span className="gradient-text">One Click.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', marginBottom: '40px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Convert, compress, merge, download — everything you need, completely free and right in your browser.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tools... (e.g. PDF, compress, QR code)"
              style={{
                width: '100%', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-bright)', borderRadius: '16px',
                paddingLeft: '48px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px',
                color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none',
              }}
              className="search-glow"
            />
          </div>

          {/* Features Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '48px' }}>
            {[
              { icon: Zap, label: 'Lightning Fast', color: '#f59e0b' },
              { icon: Shield, label: 'Privacy First', color: '#00ff88' },
              { icon: Globe, label: '100% Browser-Based', color: '#00d4ff' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <f.icon style={{ width: '16px', height: '16px', color: f.color }} />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= TOOLS SECTION ========= */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Category Tabs */}
        <div className="scrollbar-hide" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              flexShrink: 0, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: activeCategory === 'all' ? 700 : 500,
              border: activeCategory === 'all' ? 'none' : '1px solid var(--color-border)', cursor: 'pointer',
              background: activeCategory === 'all' ? 'var(--color-accent-blue)' : 'var(--color-bg-card)',
              color: activeCategory === 'all' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeCategory === 'all' ? '0 8px 25px var(--color-accent-blue-20)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            All Tools
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: activeCategory === cat.id ? 700 : 500,
                border: activeCategory === cat.id ? 'none' : '1px solid var(--color-border)', cursor: 'pointer',
                background: activeCategory === cat.id ? cat.color : 'var(--color-bg-card)',
                color: activeCategory === cat.id ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                boxShadow: activeCategory === cat.id ? `0 8px 25px ${cat.color}33` : 'none',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Showing <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{filteredTools.length}</span> tools
          </p>
          {query && (
            <button onClick={() => setQuery('')} style={{ fontSize: '12px', color: 'var(--color-accent-blue)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear search
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>No tools found</p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Try a different search term or category.</p>
          </div>
        )}
      </section>

      {/* ========= CTA SECTION ========= */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--color-border)', padding: '48px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--color-accent-blue-10), var(--color-accent-green-10))', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', background: 'var(--color-accent-blue)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.06, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              Need a tool that's not here?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              We're constantly adding new tools. Let us know what you need!
            </p>
            <a href="#" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Request a Tool <ArrowRight style={{ width: '16px', height: '16px' }} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
