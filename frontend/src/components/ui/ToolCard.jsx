import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategoryById } from '../../data/tools';

export default function ToolCard({ tool, index = 0 }) {
  const category = getCategoryById(tool.category);
  const Icon = tool.icon;

  return (
    <Link
      to={`/tool/${tool.id}`}
      className="tool-card glass-card animate-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        textDecoration: 'none',
        color: 'inherit',
        opacity: 0,
        animationDelay: `${index * 0.04}s`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Icon + Category */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '48px', height: '48px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${category?.color || 'var(--color-accent-blue)'}15`,
            transition: 'transform 0.3s',
          }}
        >
          <Icon style={{ width: '24px', height: '24px', color: category?.color || 'var(--color-accent-blue)' }} />
        </div>
        <span className="category-badge" style={{ background: `${category?.color || 'var(--color-accent-blue)'}15`, color: category?.color || 'var(--color-accent-blue)' }}>
          {category?.name || 'Tool'}
        </span>
      </div>

      {/* Name + Description */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', marginBottom: '6px', transition: 'color 0.2s' }}>
          {tool.name}
        </h3>
        <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {tool.description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--color-accent-blue)', transition: 'color 0.2s' }}>
        <span>Use Tool</span>
        <ArrowRight style={{ width: '14px', height: '14px', marginLeft: '4px' }} />
      </div>
    </Link>
  );
}
