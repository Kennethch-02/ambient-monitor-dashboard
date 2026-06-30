// src/components/EmbedTeaser.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const EmbedTeaser = () => (
  <section
    style={{
      borderRadius: 20,
      background: 'linear-gradient(135deg,color-mix(in oklch,var(--cyan) 9%,var(--bg1)),var(--bg1))',
      border: '1px solid var(--line)',
      padding: 20,
      boxShadow: 'var(--shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flexWrap: 'wrap',
    }}
  >
    <div style={{ marginRight: 'auto' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Embed this room on your site</div>
      <div style={{ fontSize: 12.5, color: 'var(--txt2)', maxWidth: '48ch' }}>
        Drop a live widget into any page with one line of HTML. Pick the metric, theme and background.
      </div>
    </div>
    <Link
      to="/embed"
      style={{
        padding: '11px 18px',
        borderRadius: 11,
        background: 'var(--optimal)',
        color: 'var(--bg0)',
        border: 'none',
        fontWeight: 600,
        fontSize: 13.5,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      Open embed builder →
    </Link>
  </section>
);

export default EmbedTeaser;
