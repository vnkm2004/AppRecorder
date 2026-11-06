// Sample Websites and Live Interactive Mockup Templates

export const SAMPLE_WEBSITES = [
  {
    name: 'ServCate Catering',
    url: 'https://servcate.com',
    category: 'Live Food & Event App',
    tag: 'Default',
  },
  {
    name: 'Google Search',
    url: 'https://www.google.com/search?igu=1',
    category: 'Live Search Engine',
    tag: 'Interactive',
  },
  {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    category: 'Live Encyclopedia',
    tag: 'Interactive',
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org',
    category: 'Digital Library',
    tag: 'Interactive',
  },
];

// Rich interactive embedded HTML demos in case user wants instant zero-lag offline demo
export const DEMO_TEMPLATES = {
  saas: {
    id: 'saas',
    name: 'AI Analytics Platform',
    category: 'SaaS Dashboard',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { background:#070b19; color:#f8fafc; padding:20px; }
          .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #1e293b; padding-bottom:14px; }
          .logo { font-weight:700; font-size:18px; color:#38bdf8; display:flex; align-items:center; gap:8px; }
          .badge { background:rgba(56,189,248,0.15); color:#38bdf8; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; }
          .hero { text-align:center; padding:32px 12px; }
          .hero h1 { font-size:26px; line-height:1.2; margin-bottom:12px; background:linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .hero p { color:#94a3b8; font-size:14px; max-width:380px; margin:0 auto 20px; line-height:1.5; }
          .btn-group { display:flex; gap:10px; justify-content:center; }
          .btn { background:#38bdf8; color:#0f172a; padding:10px 18px; border-radius:8px; font-weight:600; text-decoration:none; font-size:13px; }
          .btn-outline { background:transparent; border:1px solid #334155; color:#f8fafc; }
          .stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-top:24px; }
          .stat-card { background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:14px; }
          .stat-num { font-size:22px; font-weight:700; color:#38bdf8; margin-bottom:4px; }
          .stat-label { font-size:12px; color:#64748b; }
          .chart-mock { height:120px; background:linear-gradient(180deg, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0) 100%); border-bottom:2px solid #38bdf8; border-radius:12px; margin-top:24px; display:flex; align-items:flex-end; padding:12px; justify-content:space-between; }
          .bar { width:12%; background:#38bdf8; border-radius:4px 4px 0 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">KINETIC AI</div>
          <span class="badge">Live 4.0</span>
        </div>
        <div class="hero">
          <h1>Intelligent Real-time Cloud Metrics</h1>
          <p>Deliver ultra-low latency infrastructure insights with autonomous predictive scaling.</p>
          <div class="btn-group">
            <a href="#" class="btn">Deploy Free</a>
            <a href="#" class="btn btn-outline">Documentation</a>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">99.999%</div>
            <div class="stat-label">System Uptime</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">1.2 ms</div>
            <div class="stat-label">Global Latency</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">4.8M+</div>
            <div class="stat-label">Events Processed</div>
          </div>
        </div>
        <div class="chart-mock">
          <div class="bar" style="height:40%;"></div>
          <div class="bar" style="height:65%;"></div>
          <div class="bar" style="height:50%;"></div>
          <div class="bar" style="height:85%;"></div>
          <div class="bar" style="height:70%;"></div>
          <div class="bar" style="height:95%;"></div>
          <div class="bar" style="height:100%;"></div>
        </div>
      </body>
      </html>
    `,
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'Minimalist Fashion Store',
    category: 'E-Commerce',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system, sans-serif; }
          body { background:#0a0a0a; color:#f5f5f5; padding:16px; }
          .nav { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #262626; }
          .brand { font-size:16px; font-weight:800; letter-spacing:3px; }
          .hero-banner { margin:20px 0; height:180px; background:linear-gradient(135deg, #27272a, #18181b); border-radius:16px; display:flex; flex-direction:column; justify-content:center; padding:24px; }
          .hero-banner h2 { font-size:24px; font-weight:700; margin-bottom:6px; }
          .hero-banner p { color:#a1a1aa; font-size:13px; }
          .products { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
          .card { background:#171717; border-radius:12px; padding:12px; border:1px solid #262626; }
          .img-box { height:120px; background:#262626; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; color:#737373; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
          .title { font-size:13px; font-weight:600; margin-bottom:4px; }
          .price { font-size:12px; color:#10b981; font-weight:700; }
        </style>
      </head>
      <body>
        <div class="nav">
          <div class="brand">LUMIERE</div>
          <div style="font-size:12px; color:#a1a1aa;">BAG (2)</div>
        </div>
        <div class="hero-banner">
          <h2>AUTUMN 2026</h2>
          <p>Architectural Silhouettes & Titanium Accents</p>
        </div>
        <div class="products">
          <div class="card">
            <div class="img-box">Titanium Chrono</div>
            <div class="title">Apex Chronograph</div>
            <div class="price">$420.00</div>
          </div>
          <div class="card">
            <div class="img-box">Monolith Frame</div>
            <div class="title">Carbon Sunglasses</div>
            <div class="price">$280.00</div>
          </div>
        </div>
      </body>
      </html>
    `,
  },
};

