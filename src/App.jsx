import { useEffect, useRef } from 'react';

const students = [
  { name: 'Prompitchaya Lertwattanakitti', id: '6630251377', role: 'Frontend Developer',  icon: '⚡', image: '/ptc.png' },
  { name: 'Natthapong Chanabun',           id: '6630251113', role: 'Backend Developer',   icon: '🛠', image: '/dy.png' },
  { name: 'Peeraphas Aitha',               id: '6630251393', role: 'DevOps Engineer',     icon: '🔧', image: '/Time.png' },
  { name: 'Pipat Poltree',                 id: '6630251172', role: 'Software Tester', icon: '🚀', image: '/peach.png' },
];

/* ── Particle canvas ─────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(preAge = false) {
        this.x       = Math.random() * canvas.width;
        this.y       = preAge ? Math.random() * canvas.height : canvas.height + 10;
        this.r       = Math.random() * 1.5 + 0.3;
        this.vx      = (Math.random() - 0.5) * 0.4;
        this.vy      = -(Math.random() * 0.6 + 0.2);
        this.maxLife = Math.random() * 200 + 100;
        this.life    = preAge ? Math.random() * this.maxLife : 0;
        this.gold    = Math.random() > 0.7;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset();
      }
      draw() {
        const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(45,140,78,${alpha})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}

/* ── Student card with 3-D tilt ──────────────────────── */
function StudentCard({ student, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
    card.style.transform    = `translateY(-8px) rotateY(${x}deg) rotateX(${-y}deg)`;
    card.style.perspective  = '600px';
  };

  const handleMouseLeave = () => {
    cardRef.current.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="ku-card"
      style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
    >
      <span className="ku-num">#{String(index + 1).padStart(2, '0')}</span>

      <div
        className="ku-avatar"
        title="รูปโปรไฟล์คงที่"
      >
        <img src={student.image} alt={student.name} className="ku-avatar-img" />
        <span className="ku-avatar-ring" />
      </div>

      <p className="ku-name">{student.name}</p>

      <span className="ku-chip">
        <span className="ku-dot" />
        {student.icon} {student.role}
      </span>

      <p className="ku-id">{student.id}</p>
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────── */
export default function App() {
  return (
    <>
      {/* ── Google Fonts ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --ku-green: #1a5c2e;
          --ku-light: #2d8c4e;
          --ku-gold:  #c9a84c;
          --bg:       #0d1f15;
          --surface:  #132819;
          --surface2: #1a3320;
          --text:     #e8f5ee;
          --muted:    #7aaa8a;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Background layers */
        .ku-bg {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse at 20% 20%, #1a5c2e22 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, #c9a84c11 0%, transparent 60%),
            var(--bg);
        }
        .ku-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(45,140,78,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,140,78,.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Floating orbs */
        .ku-orb {
          position: fixed; border-radius: 50%;
          filter: blur(60px); opacity: .15; z-index: 0; pointer-events: none;
          animation: floatOrb linear infinite;
        }
        .ku-orb-1 { width:400px;height:400px;background:#2d8c4e;top:-100px;left:-100px;animation-duration:20s; }
        .ku-orb-2 { width:300px;height:300px;background:#c9a84c;bottom:-50px;right:-50px;animation-duration:15s;animation-direction:reverse; }
        .ku-orb-3 { width:200px;height:200px;background:#1a5c2e;top:50%;left:50%;animation-duration:25s; }

        @keyframes floatOrb {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(30px,-30px) scale(1.1); }
          66%      { transform:translate(-20px,20px) scale(.9); }
        }

        /* Wrapper */
        .ku-wrapper {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; padding: 0 24px 80px;
        }

        /* Header */
        .ku-header {
          text-align: center; padding: 80px 0 60px;
          animation: fadeDown .9s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-30px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Logo ring */
        .ku-logo-ring {
          width:140px;height:140px;margin:0 auto 32px;
          position:relative;display:flex;align-items:center;justify-content:center;
        }
        .ku-logo-ring::before {
          content:'';position:absolute;inset:-4px;border-radius:50%;
          background:conic-gradient(var(--ku-gold),var(--ku-light),var(--ku-gold));
          animation:spin 6s linear infinite;
        }
        .ku-logo-ring::after {
          content:'';position:absolute;inset:2px;
          border-radius:50%;background:var(--bg);
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        .ku-logo-emoji { position:relative;z-index:2;font-size:2.4rem; }

        /* Badge */
        .ku-badge {
          display:inline-block;
          background:linear-gradient(135deg,var(--ku-gold),#a07830);
          color:#0d1f15;font-size:.65rem;font-weight:700;
          letter-spacing:.2em;text-transform:uppercase;
          padding:4px 14px;border-radius:20px;margin-bottom:18px;
        }

        /* Heading */
        .ku-h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2rem,5vw,3.2rem);font-weight:900;line-height:1.1;
          background:linear-gradient(135deg,#e8f5ee 30%,var(--ku-gold));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          margin-bottom:14px;
        }
        .ku-subtitle { color:var(--muted);font-size:1rem;font-weight:300;letter-spacing:.05em; }
        .ku-divider {
          width:60px;height:2px;margin:20px auto;
          background:linear-gradient(90deg,transparent,var(--ku-gold),transparent);
        }

        /* Stats */
        .ku-stats {
          display:flex;justify-content:center;gap:40px;margin:50px 0 20px;
          animation:fadeUp 1s .5s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity:0;transform:translateY(20px); }
          to   { opacity:1;transform:translateY(0); }
        }
        .ku-stat { text-align:center; }
        .ku-stat-num { font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--ku-gold);display:block; }
        .ku-stat-label { font-size:.72rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase; }
        .ku-stat-div { width:1px;background:rgba(45,140,78,.3);height:40px;align-self:center; }

        /* Grid */
        .ku-grid-cards {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(245px,1fr));
          gap:20px; margin-top:8px;
        }

        /* Card */
        .ku-card {
          background:var(--surface);
          border:1px solid rgba(45,140,78,.2);
          border-radius:22px;padding:36px 28px;text-align:center;
          position:relative;overflow:hidden;cursor:default;
          transition:transform .4s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .4s;
          animation:cardIn .7s cubic-bezier(.16,1,.3,1) both;
          transform-style:preserve-3d;
        }
        @keyframes cardIn {
          from { opacity:0;transform:translateY(40px) scale(.95); }
          to   { opacity:1;transform:translateY(0) scale(1); }
        }
        .ku-card::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 50% 0%,rgba(45,140,78,.15) 0%,transparent 70%);
          opacity:0;transition:opacity .4s;
        }
        .ku-card::after {
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,var(--ku-gold),transparent);
          transform:scaleX(0);transition:transform .4s cubic-bezier(.16,1,.3,1);
        }
        .ku-card:hover {
          border-color:rgba(201,168,76,.4);
          box-shadow:0 24px 48px rgba(0,0,0,.4),0 0 0 1px rgba(201,168,76,.1);
        }
        .ku-card:hover::before { opacity:1; }
        .ku-card:hover::after  { transform:scaleX(1); }

        /* Card number */
        .ku-num {
          position:absolute;top:14px;right:16px;
          font-size:.65rem;font-weight:700;color:var(--ku-gold);
          letter-spacing:.1em;opacity:.6;
        }

        /* Avatar */
        .ku-avatar {
          width:110px;height:110px;border-radius:50%;
          margin:6px auto 24px;display:flex;align-items:center;justify-content:center;
          font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;
          position:relative;
          background:linear-gradient(135deg,var(--ku-green),var(--ku-light));
          box-shadow:0 0 0 3px var(--surface2),0 0 0 4px rgba(45,140,78,.4);
          transition:box-shadow .3s;
        }
        .ku-card:hover .ku-avatar {
          box-shadow:0 0 0 3px var(--surface2),0 0 0 5px var(--ku-gold),0 8px 20px rgba(45,140,78,.4);
        }
        .ku-avatar-ring {
          position:absolute;inset:-6px;border-radius:50%;
          border:1px dashed rgba(45,140,78,.3);
          animation:spinSlow 10s linear infinite;
          display:block;
        }
        .ku-card:hover .ku-avatar-ring {
          border-color:rgba(201,168,76,.5);
          animation-duration:3s;
        }
        @keyframes spinSlow { to { transform:rotate(360deg); } }

        /* Name */
        .ku-name { font-weight:500;font-size:.95rem;line-height:1.4;color:var(--text); }

        /* Role chip */
        .ku-chip {
          display:inline-flex;align-items:center;gap:5px;
          background:rgba(45,140,78,.15);border:1px solid rgba(45,140,78,.3);
          color:#6dd48a;font-size:.72rem;font-weight:500;
          padding:4px 12px;border-radius:20px;margin:8px 0 12px;
          transition:background .3s,border-color .3s,color .3s;
        }
        .ku-card:hover .ku-chip {
          background:rgba(201,168,76,.12);border-color:rgba(201,168,76,.35);color:var(--ku-gold);
        }
        .ku-dot {
          width:5px;height:5px;border-radius:50%;background:currentColor;
          animation:blink 2s ease-in-out infinite;display:inline-block;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* ID */
        .ku-id {
          font-size:.75rem;color:var(--muted);margin-top:8px;
          font-family:monospace;letter-spacing:.05em;
          background:rgba(255,255,255,.04);padding:4px 10px;border-radius:6px;display:inline-block;
        }

        /* Upload hint overlay */
        .ku-upload-hint {
          position:absolute;border-radius:50%;
          background:rgba(0,0,0,.55);
          display:flex;align-items:center;justify-content:center;
          font-size:1.2rem;opacity:0;
          transition:opacity .3s;z-index:4;pointer-events:none;
        }
        .ku-logo-ring .ku-upload-hint { inset:2px; }
        .ku-avatar .ku-upload-hint { inset:0; }
        .ku-logo-ring:hover .ku-upload-hint,
        .ku-avatar:hover .ku-upload-hint { opacity:1; }

        /* Uploaded images */
        .ku-logo-img {
          position:relative;z-index:2;
          width:116px;height:116px;border-radius:50%;object-fit:cover;
        }
        .ku-avatar-img {
          position:absolute;inset:0;
          width:100%;height:100%;border-radius:50%;object-fit:cover;z-index:1;
        }

        /* Footer */
        .ku-footer {
          margin-top:60px;text-align:center;color:var(--muted);font-size:.8rem;
          border-top:1px solid rgba(45,140,78,.15);padding-top:30px;
          animation:fadeUp 1s .6s both;
        }
        .ku-footer strong { color:var(--ku-gold); }
      `}</style>

      <ParticleCanvas />
      <div className="ku-bg" />
      <div className="ku-grid" />
      <div className="ku-orb ku-orb-1" />
      <div className="ku-orb ku-orb-2" />
      <div className="ku-orb ku-orb-3" />

      <div className="ku-wrapper">
        <header className="ku-header">
          <div
            className="ku-logo-ring"
            title="โลโก้คงที่"
          >
            <img src="/KU.png" alt="Kasetsart University Logo" className="ku-logo-img" />
          </div>
          <div className="ku-badge">Kasetsart University</div>
          <h1 className="ku-h1">Student Dev Team</h1>
          <div className="ku-divider" />
          <p className="ku-subtitle">
            CI/CD Pipeline for React Web Application<br />
            Faculty of Science · Computer Science
          </p>
        </header>

        <div className="ku-stats">
          <div className="ku-stat">
            <span className="ku-stat-num">4</span>
            <span className="ku-stat-label">Members</span>
          </div>
          <div className="ku-stat-div" />
          <div className="ku-stat">
            <span className="ku-stat-num">1</span>
            <span className="ku-stat-label">Project</span>
          </div>
          <div className="ku-stat-div" />
          <div className="ku-stat">
            <span className="ku-stat-num">∞</span>
            <span className="ku-stat-label">Commits</span>
          </div>
        </div>

        <div className="ku-grid-cards">
          {students.map((student, i) => (
            <StudentCard key={student.id} student={student} index={i} />
          ))}
        </div>

        <footer className="ku-footer">
          <p>🌿 <strong>Kasetsart University</strong> · Faculty of Science</p>
          <p style={{ marginTop: 6 }}>DevOps &amp; CI/CD React Project · 2024</p>
        </footer>
      </div>
    </>
  );
}
