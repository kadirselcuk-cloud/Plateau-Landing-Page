import { useEffect, useRef } from 'react';

const NAVY   = '#151233';
const RED_R  = 253;
const RED_G  = 69;
const RED_B  = 76;

const RINGS = [
  { f: 0.87, label: 'EDGE',      phase: 0,              rot:  0.00028 },
  { f: 0.65, label: 'IAM',       phase: Math.PI * 0.5,  rot: -0.00022 },
  { f: 0.45, label: 'HEIMDALLR', phase: Math.PI,        rot:  0.00025 },
  { f: 0.27, label: 'ZOKA',      phase: Math.PI * 1.5,  rot: -0.00030 },
];

// Block probability increases at each deeper layer
const BLOCK_PROB = [0.62, 0.72, 0.80, 0.88];

class Particle {
  constructor() { this.reset(true); }

  reset(scatter = false) {
    this.angle    = Math.random() * Math.PI * 2;
    this.r        = 1; // fraction of maxR — set in update()
    this.isThreat = Math.random() < 0.62;
    this.speed    = 0.6 + Math.random() * 1.2;
    this.size     = 2.2 + Math.random() * 2.0;
    this.state    = 'moving';
    this.explodeR = 0;
    this.explodeOp= 0;
    this.ringsDone= 0;
    this._scatter = scatter;
  }

  update(maxR) {
    if (this._scatter) {
      // First frame: scatter inward at random depth
      this.r = maxR * (0.55 + Math.random() * 0.42);
      this._scatter = false;
    }

    if (this.state === 'exploding') {
      this.explodeR  += 2.8;
      this.explodeOp -= 0.05;
      if (this.explodeOp <= 0) this.state = 'done';
      return;
    }

    this.r -= this.speed;

    for (let i = this.ringsDone; i < RINGS.length; i++) {
      const ringR = maxR * RINGS[i].f;
      if (this.r < ringR) {
        this.ringsDone = i + 1;
        if (this.isThreat && Math.random() < BLOCK_PROB[i]) {
          this.state    = 'exploding';
          this.explodeR = this.size;
          this.explodeOp= 1;
          return;
        }
      }
    }

    if (this.r < maxR * 0.06) this.state = 'done';
  }

  draw(ctx, cx, cy) {
    const x = cx + Math.cos(this.angle) * this.r;
    const y = cy + Math.sin(this.angle) * this.r;

    if (this.state === 'exploding') {
      // Outer burst ring
      ctx.beginPath();
      ctx.arc(x, y, this.explodeR * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${RED_R},${RED_G},${RED_B},${this.explodeOp * 0.35})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Inner flash
      ctx.beginPath();
      ctx.arc(x, y, this.explodeR * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RED_R},${RED_G},${RED_B},${this.explodeOp * 0.9})`;
      ctx.fill();
      // White hot core
      ctx.beginPath();
      ctx.arc(x, y, this.explodeR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.explodeOp})`;
      ctx.fill();
      return;
    }

    const col = this.isThreat
      ? `${RED_R},${RED_G},${RED_B}`
      : '180,180,230';

    // Motion trail
    const trailLen = this.speed * 10;
    const tx = x + Math.cos(this.angle) * trailLen;
    const ty = y + Math.sin(this.angle) * trailLen;
    const grad = ctx.createLinearGradient(x, y, tx, ty);
    grad.addColorStop(0, `rgba(${col},0.85)`);
    grad.addColorStop(1, `rgba(${col},0)`);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = grad;
    ctx.lineWidth = this.size * 0.75;
    ctx.stroke();

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${col},0.95)`;
    ctx.fill();
  }
}

export default function SecurityHeroAnimation() {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const stateRef  = useRef(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // ---- sizing ----
    const resize = () => {
      const s = Math.round(Math.min(wrap.offsetWidth, wrap.offsetHeight));
      if (canvas.width !== s || canvas.height !== s) {
        canvas.width  = s;
        canvas.height = s;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ---- state ----
    const particles  = Array.from({ length: 22 }, () => new Particle());
    const ringAngles = RINGS.map(() => 0);
    stateRef.current = { particles, ringAngles };

    // ---- draw loop ----
    const draw = (ts) => {
      resize();
      const s    = canvas.width;
      const cx   = s / 2;
      const cy   = s / 2;
      const maxR = s * 0.435;

      const { particles, ringAngles } = stateRef.current;

      ctx.clearRect(0, 0, s, s);

      // Background + subtle grid
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, s, s);

      // Dot grid overlay
      const gridStep = Math.round(s / 18);
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      for (let gx = gridStep; gx < s; gx += gridStep) {
        for (let gy = gridStep; gy < s; gy += gridStep) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rings
      RINGS.forEach((ring, i) => {
        ringAngles[i] += ring.rot;
        const r     = maxR * ring.f;
        const pulse = 1 + Math.sin(ts * 0.0009 + ring.phase) * 0.007;
        const rp    = r * pulse;
        const alpha = 0.22 + Math.sin(ts * 0.0011 + ring.phase) * 0.06;

        // Glow halo
        const halo = ctx.createRadialGradient(cx, cy, rp * 0.93, cx, cy, rp * 1.08);
        halo.addColorStop(0, `rgba(${RED_R},${RED_G},${RED_B},${alpha * 0.7})`);
        halo.addColorStop(1, `rgba(${RED_R},${RED_G},${RED_B},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, rp * 1.08, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Rotating dashed ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringAngles[i]);
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        ctx.arc(cx, cy, rp, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RED_R},${RED_G},${RED_B},${alpha + 0.18})`;
        ctx.lineWidth   = 0.9;
        ctx.setLineDash([10, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Label — slightly above the ring
        const labelR = rp + 11;
        const lx = cx;
        const ly = cy - labelR;
        ctx.save();
        ctx.font      = `500 8px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(${RED_R},${RED_G},${RED_B},${alpha + 0.4})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(ring.label, lx, ly);
        ctx.restore();
      });

      // Core glow
      const coreR   = s * 0.055;
      const cPulse  = 1 + Math.sin(ts * 0.0018) * 0.06;
      const coreGlo = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.5);
      coreGlo.addColorStop(0, 'rgba(255,255,255,0.14)');
      coreGlo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGlo;
      ctx.fill();

      // Core disc
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * cPulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.93)';
      ctx.fill();

      // Core label
      ctx.save();
      ctx.font = `bold ${Math.max(7, Math.round(coreR * 0.52))}px "JetBrains Mono", monospace`;
      ctx.fillStyle    = NAVY;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CORE', cx, cy);
      ctx.restore();

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(maxR);
        if (p.state === 'done') {
          particles[i] = new Particle();
        } else {
          p.draw(ctx, cx, cy);
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: NAVY,
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
