import { useEffect, useRef } from 'react';

const NAVY = '#151233';

const C = {
  red:    [253,  69,  76],
  blue:   [ 79, 124, 255],
  teal:   [ 62, 207, 207],
  green:  [ 62, 207, 124],
  purple: [160, 100, 255],
  amber:  [255, 180,  60],
  white:  [255, 255, 255],
  dim:    [180, 180, 230],
  slate:  [ 90,  90, 150],
};

const rgb = (col, a) => `rgba(${col[0]},${col[1]},${col[2]},${a})`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function rrp(ctx, x, y, w, h, r) {
  r = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);     ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);     ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);         ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}
const fillRR   = (ctx, x, y, w, h, r, col)      => { rrp(ctx,x,y,w,h,r); ctx.fillStyle=col; ctx.fill(); };
const strokeRR = (ctx, x, y, w, h, r, col, lw=1) => { rrp(ctx,x,y,w,h,r); ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.stroke(); };

function radialGlow(ctx, cx, cy, r, col, a) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, rgb(col, a)); g.addColorStop(1, rgb(col, 0));
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
}

function dotGrid(ctx, W, H, col, a) {
  const s = Math.round(W / 18);
  ctx.fillStyle = rgb(col, a);
  for (let x = s; x < W; x += s)
    for (let y = s; y < H; y += s) {
      ctx.beginPath(); ctx.arc(x, y, 0.75, 0, Math.PI * 2); ctx.fill();
    }
}

function monoLabel(ctx, text, x, y, col, a, size, align = 'center') {
  ctx.save();
  ctx.font = `500 ${size}px "JetBrains Mono", monospace`;
  ctx.fillStyle = rgb(col, a);
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;

function bezierPt(t, p0, p1, p2) {
  const mt = 1 - t;
  return { x: mt*mt*p0.x + 2*mt*t*p1.x + t*t*p2.x,
           y: mt*mt*p0.y + 2*mt*t*p1.y + t*t*p2.y };
}

function lerpPt(A, B, f) {
  return { x: A.x + (B.x - A.x) * f, y: A.y + (B.y - A.y) * f };
}

// ── Scene 1 · Drag & Drop UI Development ─────────────────────────────────────
// Left panel = component palette with labels.
// Right area = design canvas with grid.
// A component chip is picked from the palette every ~1.4 s, flies via bezier
// arc to its drop zone on the canvas, and snaps in. All other slots show the
// already-placed components with their labels.

const UI_COMPS = [
  { label: 'Header',  col: C.blue,   dest: { nx:0,    ny:0,    nw:1,    nh:0.12 } },
  { label: 'Sidebar', col: C.purple, dest: { nx:0,    ny:0.14, nw:0.19, nh:0.69 } },
  { label: 'Content', col: C.teal,   dest: { nx:0.21, ny:0.14, nw:0.58, nh:0.43 } },
  { label: 'Input',   col: C.green,  dest: { nx:0.21, ny:0.59, nw:0.58, nh:0.10 } },
  { label: 'Button',  col: C.amber,  dest: { nx:0.21, ny:0.71, nw:0.26, nh:0.09 } },
  { label: 'Footer',  col: C.slate,  dest: { nx:0,    ny:0.82, nw:1,    nh:0.18 } },
];

function scene1(ctx, W, H, ts) {
  const CYCLE_MS = 1400;
  const cycleNum = Math.floor(ts / CYCLE_MS);
  const cycleT   = (ts % CYCLE_MS) / CYCLE_MS;   // 0..1 within current drag
  const dragIdx  = cycleNum % UI_COMPS.length;
  const comp     = UI_COMPS[dragIdx];

  dotGrid(ctx, W, H, C.blue, 0.035);

  // ── Left palette panel ──────────────────────────────────────────────────────
  const panX = W*0.02, panY = H*0.05, panW = W*0.25, panH = H*0.90;
  fillRR  (ctx, panX, panY, panW, panH, 6, rgb(C.blue, 0.05));
  strokeRR(ctx, panX, panY, panW, panH, 6, rgb(C.blue, 0.14), 0.7);

  monoLabel(ctx, 'COMPONENTS', panX + panW/2, panY + panH*0.052, C.blue, 0.44, 7);
  // divider
  ctx.beginPath();
  ctx.moveTo(panX + 8, panY + panH*0.092); ctx.lineTo(panX + panW - 8, panY + panH*0.092);
  ctx.strokeStyle = rgb(C.blue, 0.11); ctx.lineWidth = 0.6; ctx.stroke();

  const itH = H*0.098, itGap = H*0.014;
  const itX = panX + panW*0.08, itW = panW*0.84;
  const iy0 = panY + panH*0.12;

  UI_COMPS.forEach((c, i) => {
    const iy = iy0 + i * (itH + itGap);
    const dragging = i === dragIdx;
    const a = dragging ? 0.04 : 0.10;
    fillRR  (ctx, itX, iy, itW, itH, 4, rgb(c.col, a));
    strokeRR(ctx, itX, iy, itW, itH, 4, rgb(c.col, dragging ? 0.16 : 0.28), dragging ? 0.5 : 0.8);
    // colour swatch
    fillRR(ctx, itX + 6, iy + itH*0.28, itW*0.16, itH*0.44, 2, rgb(c.col, dragging ? 0.22 : 0.52));
    // label
    monoLabel(ctx, c.label, itX + itW*0.60, iy + itH/2, c.col, dragging ? 0.20 : 0.68, 8, 'left');
    // grab handle  »
    if (!dragging) monoLabel(ctx, '»', itX + itW - 6, iy + itH/2, c.col, 0.22, 8, 'right');
  });

  // ── Canvas area ─────────────────────────────────────────────────────────────
  const cvX = panX + panW + W*0.05, cvY = panY, cvW = W - cvX - W*0.02, cvH = panH;
  fillRR  (ctx, cvX, cvY, cvW, cvH, 6, rgb(C.blue, 0.03));
  strokeRR(ctx, cvX, cvY, cvW, cvH, 6, rgb(C.blue, 0.09), 0.6);

  // dot grid on canvas
  const gs = 14;
  ctx.fillStyle = rgb(C.blue, 0.055);
  for (let gx = cvX + gs; gx < cvX + cvW - 4; gx += gs)
    for (let gy = cvY + gs; gy < cvY + cvH - 4; gy += gs) {
      ctx.beginPath(); ctx.arc(gx, gy, 0.65, 0, Math.PI*2); ctx.fill();
    }

  // Placed component slots
  UI_COMPS.forEach((c, i) => {
    const d = c.dest;
    const x = cvX + d.nx*cvW + 2, y = cvY + d.ny*cvH + 2;
    const w = d.nw*cvW - 4,       h = d.nh*cvH - 4;
    const isTarget = i === dragIdx;
    const p = (Math.sin(ts*0.0009 + i*1.2) + 1) / 2;

    if (isTarget) {
      // Pulsing dashed drop-zone
      rrp(ctx, x, y, w, h, 4);
      ctx.strokeStyle = rgb(c.col, 0.22 + Math.sin(ts*0.007)*0.10);
      ctx.lineWidth = 1; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      fillRR(ctx, x, y, w, h, 4, rgb(c.col, 0.04));
    } else {
      fillRR  (ctx, x, y, w, h, 4, rgb(c.col, 0.09 + p*0.04));
      strokeRR(ctx, x, y, w, h, 4, rgb(c.col, 0.20 + p*0.08), 0.8);
      const fs = Math.min(9, Math.max(5.5, h * 0.26));
      monoLabel(ctx, c.label.toUpperCase(), x + w/2, y + h/2, c.col, 0.36, fs);
      if (h > 28)
        for (let j = 0; j < Math.min(2, Math.floor(h/16)); j++)
          fillRR(ctx, x+6, y + h*(0.24 + j*0.26), w*(0.52 - j*0.08), Math.max(2, h*0.08), 2, rgb(c.col, 0.14));
    }
  });

  // ── In-flight component chip ─────────────────────────────────────────────────
  // Source: right edge of palette item, vertically centred on it
  const iy     = iy0 + dragIdx * (itH + itGap);
  const srcX   = panX + panW, srcY = iy + itH/2;
  // Destination: centre of canvas drop zone
  const d      = comp.dest;
  const dstX   = cvX + (d.nx + d.nw/2) * cvW;
  const dstY   = cvY + (d.ny + d.nh/2) * cvH;
  // Bezier control: arc upward between src and dst
  const ctrlX  = (srcX + dstX) / 2;
  const ctrlY  = Math.min(srcY, dstY) - H*0.13;
  // Chip size: fixed, readable
  const chipW  = Math.min(d.nw * cvW * 0.72, 84);
  const chipH  = Math.max(22, Math.min(d.nh * cvH * 0.72, 30));

  let tx = 0, ty = 0, trot = 0, tscale = 1, talpha = 0;

  if (cycleT < 0.07) {                      // LIFT
    const f = cycleT / 0.07;
    tx = srcX; ty = srcY - f*7; trot = f*0.07; tscale = 1 + f*0.09; talpha = f;
  } else if (cycleT < 0.80) {               // FLY
    const f = ease((cycleT - 0.07) / 0.73);
    const b = bezierPt(f, {x:srcX, y:srcY-7}, {x:ctrlX, y:ctrlY}, {x:dstX, y:dstY});
    tx = b.x; ty = b.y; trot = Math.sin(f*Math.PI)*0.10; tscale = 1.08; talpha = 1;
  } else if (cycleT < 0.93) {               // SNAP
    const f = (cycleT - 0.80) / 0.13;
    tx = dstX; ty = dstY; trot = (1-f)*0.04; tscale = 1.08 - f*0.16; talpha = 1 - f*0.75;
  }

  if (talpha > 0.02) {
    ctx.save();
    ctx.globalAlpha = talpha;
    ctx.translate(tx, ty); ctx.rotate(trot); ctx.scale(tscale, tscale);
    radialGlow(ctx, 0, 6, chipW*0.8, comp.col, 0.28);
    fillRR  (ctx, -chipW/2, -chipH/2, chipW, chipH, 4, rgb(comp.col, 0.22));
    strokeRR(ctx, -chipW/2, -chipH/2, chipW, chipH, 4, rgb(comp.col, 0.82), 1.4);
    monoLabel(ctx, comp.label.toUpperCase(), 0, 0, comp.col, 0.85, 8);
    ctx.restore();
    // cursor (not scaled/rotated)
    ctx.save();
    ctx.globalAlpha = talpha;
    radialGlow(ctx, tx + chipW*0.44, ty + chipH*0.44, 10, C.white, 0.22);
    ctx.beginPath(); ctx.arc(tx + chipW*0.44, ty + chipH*0.44, 3, 0, Math.PI*2);
    ctx.fillStyle = rgb(C.white, 0.9); ctx.fill();
    ctx.restore();
  }
}

// ── Scene 2 · Mobile Application & SuperApp ───────────────────────────────────
// Phone frame in centre. Inside: 3×3 mini-app tile grid with names.
// Connection arrows reach OUT from the phone (from the edge aligned with each
// tile) to external partner service boxes.  Two connections cycle at a time;
// animated packet dots travel outward along each active connection.

const MINIAPPS = [
  { label: 'Bank',   col: C.teal   },  // 0  row0 col0  → left
  { label: 'Shop',   col: C.blue   },  // 1  row0 col1
  { label: 'Pay',    col: C.green  },  // 2  row0 col2  → right
  { label: 'Ride',   col: C.purple },  // 3  row1 col0  → left
  { label: 'Food',   col: C.amber  },  // 4  row1 col1
  { label: 'Health', col: C.teal   },  // 5  row1 col2  → right
  { label: 'Maps',   col: C.blue   },  // 6  row2 col0
  { label: 'Games',  col: C.purple },  // 7  row2 col1
  { label: 'News',   col: C.dim    },  // 8  row2 col2
];

// Partners: side = which phone edge to exit from; appIdx = tile that connects
const PARTNERS = [
  { label: 'BANK API',  col: C.teal,   side: 'left',  fy: 0.28, appIdx: 0 },
  { label: 'PAYMENTS',  col: C.green,  side: 'left',  fy: 0.64, appIdx: 3 },
  { label: 'COMMERCE',  col: C.blue,   side: 'right', fy: 0.28, appIdx: 2 },
  { label: 'TRANSIT',   col: C.purple, side: 'right', fy: 0.64, appIdx: 5 },
];

function scene2(ctx, W, H, ts) {
  dotGrid(ctx, W, H, C.teal, 0.028);

  const cx = W/2, cy = H/2;
  const ph = H*0.74, pw = ph*0.44;
  const px = cx - pw/2, py = cy - ph/2;
  const pr = pw * 0.10;

  // Which connection pair is active (swap every 2 s)
  const connCycle = Math.floor(ts / 2000) % 2;  // 0 → partners 0&2, 1 → partners 1&3
  const connPhase = (ts % 2000) / 2000;         // 0..1 packet travel

  // Tile geometry (needed for exit-point calculation before phone is drawn)
  const COLS = 3, ROWS = 3;
  const tpad  = pw * 0.05;
  const tileW = (pw - tpad * (COLS + 1)) / COLS;
  const tileH = (ph * 0.78 - tpad * (ROWS + 1)) / ROWS;
  const gridY = py + ph * 0.155;

  function tileCentre(appIdx) {
    const row = Math.floor(appIdx / COLS), col = appIdx % COLS;
    return {
      x: px + tpad + col * (tileW + tpad) + tileW / 2,
      y: gridY + row * (tileH + tpad) + tileH / 2,
    };
  }

  // Box geometry
  const bw = W * 0.16, bh = H * 0.09;
  function boxRect(p) {
    const bx = p.side === 'left' ? px - bw - W*0.055 : px + pw + W*0.055;
    const by = py + ph * p.fy - bh / 2;
    return { bx, by, bw, bh, bcx: bx + bw/2, bcy: by + bh/2 };
  }

  // ── 1. Partner boxes ────────────────────────────────────────────────────────
  PARTNERS.forEach((p, i) => {
    const { bx, by, bcx, bcy } = boxRect(p);
    const pulse = (Math.sin(ts * 0.0009 + i * 1.7) + 1) / 2;
    const isActive = i % 2 === connCycle;
    radialGlow(ctx, bcx, bcy, bw * 0.85, p.col, (isActive ? 0.22 : 0.10) + pulse*0.06);
    fillRR  (ctx, bx, by, bw, bh, 5, rgb(p.col, (isActive ? 0.14 : 0.07) + pulse*0.04));
    strokeRR(ctx, bx, by, bw, bh, 5, rgb(p.col, (isActive ? 0.55 : 0.28) + pulse*0.14), isActive ? 1 : 0.75);
    monoLabel(ctx, p.label, bcx, bcy, p.col, isActive ? 0.80 : 0.48, 7);
  });

  // ── 2. Connection arrows (drawn before phone body) ──────────────────────────
  PARTNERS.forEach((p, i) => {
    const tc     = tileCentre(p.appIdx);
    const { bx, by, bcx, bcy } = boxRect(p);
    const isActive = i % 2 === connCycle;

    // Exit point: phone edge at tile's Y (clamped to phone bounds)
    const edgeX = p.side === 'left' ? px : px + pw;
    const edgeY = Math.max(py + pr + 4, Math.min(py + ph - pr - 4, tc.y));

    // Full line: tile → edge → partner box (two segments, or straight depending on geometry)
    // Draw as two segments: tile-centre → edge, then edge → box-centre
    ctx.beginPath();
    ctx.moveTo(tc.x, tc.y);
    ctx.lineTo(edgeX, edgeY);
    ctx.lineTo(bcx, bcy);
    ctx.strokeStyle = rgb(p.col, isActive ? 0.38 : 0.09);
    ctx.lineWidth   = isActive ? 1.1 : 0.7;
    ctx.stroke();

    if (isActive) {
      // Arrowhead at partner box
      const dx  = bcx - edgeX, dy = bcy - edgeY;
      const len = Math.sqrt(dx*dx + dy*dy);
      const ux  = dx/len, uy = dy/len;
      const ax  = bcx - ux*9, ay = bcy - uy*9;
      ctx.beginPath();
      ctx.moveTo(bcx, bcy);
      ctx.lineTo(ax - uy*5, ay + ux*5);
      ctx.lineTo(ax + uy*5, ay - ux*5);
      ctx.closePath();
      ctx.fillStyle = rgb(p.col, 0.60); ctx.fill();

      // Animated packet dot traveling from edge → partner box
      const packetT = (connPhase + i*0.22) % 1;
      // Animate along two segments proportionally
      const seg1Len = Math.hypot(edgeX - tc.x, edgeY - tc.y);
      const seg2Len = Math.hypot(bcx - edgeX, bcy - edgeY);
      const totalLen = seg1Len + seg2Len;
      const seg1Frac = seg1Len / totalLen;

      let dotX, dotY;
      if (packetT < seg1Frac) {
        const f = packetT / seg1Frac;
        dotX = tc.x + (edgeX - tc.x) * f;
        dotY = tc.y + (edgeY - tc.y) * f;
      } else {
        const f = (packetT - seg1Frac) / (1 - seg1Frac);
        dotX = edgeX + (bcx - edgeX) * f;
        dotY = edgeY + (bcy - edgeY) * f;
      }
      radialGlow(ctx, dotX, dotY, 9, p.col, 0.32);
      ctx.beginPath(); ctx.arc(dotX, dotY, 2.6, 0, Math.PI*2);
      ctx.fillStyle = rgb(p.col, 0.90); ctx.fill();
    }
  });

  // ── 3. Phone body (transparent fill — connections visible inside) ────────────
  fillRR(ctx, px, py, pw, ph, pr, rgb(C.teal, 0.04));

  // ── 4. Tile grid (clipped to screen — tiles sit on top of connection starts) ─
  ctx.save();
  rrp(ctx, px + 1, py + ph*0.062, pw - 2, ph*0.882);
  ctx.clip();

  // Status bar
  fillRR(ctx, px, py + ph*0.062, pw, ph*0.065, 0, rgb(C.teal, 0.09));

  MINIAPPS.forEach((app, idx) => {
    const row = Math.floor(idx / COLS), col = idx % COLS;
    const tx  = px + tpad + col * (tileW + tpad);
    const ty  = gridY + row * (tileH + tpad);
    const tc  = { x: tx + tileW/2, y: ty + tileH/2 };
    const pp  = (Math.sin(ts * 0.0010 + idx * 0.73) + 1) / 2;
    const isConn = PARTNERS.some((p, pi) => p.appIdx === idx && pi % 2 === connCycle);

    if (isConn) radialGlow(ctx, tc.x, tc.y, tileW * 0.72, app.col, 0.28 + pp*0.12);

    fillRR  (ctx, tx, ty, tileW, tileH, 5, rgb(app.col, 0.10 + pp*0.05 + (isConn ? 0.08 : 0)));
    strokeRR(ctx, tx, ty, tileW, tileH, 5, rgb(app.col, 0.30 + pp*0.15 + (isConn ? 0.20 : 0)), isConn ? 1.1 : 0.7);

    // Icon dot
    ctx.beginPath(); ctx.arc(tc.x, tc.y - tileH*0.12, tileW*0.18, 0, Math.PI*2);
    ctx.fillStyle = rgb(app.col, 0.52 + pp*0.22); ctx.fill();

    // App name
    const fs = Math.min(7, tileW * 0.22);
    monoLabel(ctx, app.label, tc.x, tc.y + tileH*0.28, app.col, isConn ? 0.82 : 0.55, fs);
  });

  ctx.restore();

  // ── 5. Phone border (on top — naturally frames the exit points) ──────────────
  strokeRR(ctx, px, py, pw, ph, pr, rgb(C.teal, 0.50), 1.2);
  // Notch
  const nw = pw*0.26, nh = ph*0.020;
  fillRR(ctx, cx - nw/2, py + ph*0.022, nw, nh, nh/2, rgb(C.teal, 0.38));
  // Home bar
  fillRR(ctx, cx - pw*0.16, py + ph*0.950, pw*0.32, ph*0.013, 3, rgb(C.teal, 0.30));
}

// ── Scene 3 · Workflow ────────────────────────────────────────────────────────
function scene3(ctx, W, H, ts) {
  dotGrid(ctx, W, H, C.amber, 0.028);

  const ND = [
    { x:0.10, y:0.50, type:'start',   col:C.green  },
    { x:0.30, y:0.50, type:'task',    col:C.blue   },
    { x:0.52, y:0.50, type:'gateway', col:C.amber  },
    { x:0.72, y:0.28, type:'task',    col:C.teal   },
    { x:0.72, y:0.72, type:'task',    col:C.purple },
    { x:0.90, y:0.28, type:'end',     col:C.green  },
    { x:0.90, y:0.72, type:'end',     col:C.green  },
  ];
  const np = n => ({ x: W*n.x, y: H*n.y });
  const EDGES = [[0,1],[1,2],[2,3],[2,4],[3,5],[4,6]];

  EDGES.forEach(([a, b]) => {
    const A = np(ND[a]), B = np(ND[b]);
    const dx = B.x-A.x, dy = B.y-A.y, len = Math.sqrt(dx*dx+dy*dy);
    const ux = dx/len, uy = dy/len;
    ctx.beginPath();
    ctx.moveTo(A.x + ux*14, A.y + uy*14); ctx.lineTo(B.x - ux*14, B.y - uy*14);
    ctx.strokeStyle = rgb(C.dim, 0.22); ctx.lineWidth = 1; ctx.stroke();
    const ax = B.x - ux*14, ay = B.y - uy*14;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - ux*9 - uy*4, ay - uy*9 + ux*4);
    ctx.lineTo(ax - ux*9 + uy*4, ay - uy*9 - ux*4);
    ctx.closePath(); ctx.fillStyle = rgb(C.dim, 0.22); ctx.fill();
  });

  const nodeLabels = ['START', 'REVIEW', '', 'APPROVE', 'REJECT', 'DONE', 'DONE'];
  ND.forEach((n, i) => {
    const { x, y } = np(n);
    const p = (Math.sin(ts*0.001 + n.x*4) + 1) / 2;
    if (n.type === 'start' || n.type === 'end') {
      const r = W*0.036;
      radialGlow(ctx, x, y, r*2.2, n.col, 0.12 + p*0.06);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = rgb(n.col, 0.12 + p*0.05); ctx.fill();
      ctx.strokeStyle = rgb(n.col, 0.40 + p*0.15); ctx.lineWidth = 1; ctx.stroke();
      if (nodeLabels[i]) monoLabel(ctx, nodeLabels[i], x, y + r + 9, n.col, 0.45, 6.5);
    } else if (n.type === 'gateway') {
      const s = W*0.048;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI/4);
      radialGlow(ctx, 0, 0, s*2.2, n.col, 0.14 + p*0.08);
      rrp(ctx, -s*0.72, -s*0.72, s*1.44, s*1.44, 2);
      ctx.fillStyle = rgb(n.col, 0.10 + p*0.05); ctx.fill();
      ctx.strokeStyle = rgb(n.col, 0.38 + p*0.14); ctx.lineWidth = 0.9; ctx.stroke();
      ctx.restore();
    } else {
      const tw = W*0.10, th = H*0.11;
      radialGlow(ctx, x, y, tw*1.1, n.col, 0.12 + p*0.06);
      fillRR  (ctx, x-tw/2, y-th/2, tw, th, 4, rgb(n.col, 0.09 + p*0.04));
      strokeRR(ctx, x-tw/2, y-th/2, tw, th, 4, rgb(n.col, 0.35 + p*0.12), 0.85);
      if (nodeLabels[i]) monoLabel(ctx, nodeLabels[i], x, y, n.col, 0.52, 7);
      for (let j = 0; j < 2; j++)
        fillRR(ctx, x-tw/2+5, y-th/2+th*(0.28+j*0.30), tw*(0.58-j*0.10), th*0.12, 2, rgb(n.col, 0.22));
    }
  });

  const PERIOD = 5000;
  const t = (ts % PERIOD) / PERIOD;
  const P = ND.map(n => np(n));

  function tok(pos, col, a = 1) {
    ctx.save(); ctx.globalAlpha = a;
    radialGlow(ctx, pos.x, pos.y, 16, col, 0.32);
    ctx.beginPath(); ctx.arc(pos.x, pos.y, 5, 0, Math.PI*2);
    ctx.fillStyle = rgb(col, 0.95); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.x, pos.y, 7.5, 0, Math.PI*2);
    ctx.strokeStyle = rgb(col, 0.35); ctx.lineWidth = 0.8; ctx.stroke();
    ctx.restore();
  }

  if      (t < 0.14) tok(lerpPt(P[0], P[1], ease(t/0.14)), C.white);
  else if (t < 0.28) tok(lerpPt(P[1], P[2], ease((t-0.14)/0.14)), C.white);
  else if (t < 0.36) tok(P[2], C.white);
  else if (t < 0.62) {
    const f = ease((t-0.36)/0.26);
    tok(lerpPt(P[2], P[3], f), C.white);
    tok(lerpPt(P[2], P[4], f), C.white);
  } else if (t < 0.88) {
    const f = ease((t-0.62)/0.26);
    tok(lerpPt(P[3], P[5], f), C.white);
    tok(lerpPt(P[4], P[6], f), C.white);
  } else {
    const a = 1 - (t-0.88)/0.12;
    tok(P[5], C.white, a); tok(P[6], C.white, a);
  }
}

// ── Scene 4 · Security Suite ──────────────────────────────────────────────────
const S4_RINGS = [
  { f:0.88, phase:0,              rot: 0.00028 },
  { f:0.60, phase:Math.PI*0.6,   rot:-0.00022 },
  { f:0.33, phase:Math.PI*1.3,   rot: 0.00025 },
];
const S4_LABELS = ['EDGE', 'IAM', 'VAULT'];

function scene4(ctx, W, H, ts) {
  const cx = W/2, cy = H/2;
  const maxR = Math.min(W, H) * 0.42;
  radialGlow(ctx, cx, cy, maxR*1.7, C.red, 0.10);
  dotGrid(ctx, W, H, C.red, 0.025);

  S4_RINGS.forEach((ring, i) => {
    const angle = ts * ring.rot;
    const r     = maxR * ring.f;
    const pulse = 1 + Math.sin(ts*0.001 + ring.phase) * 0.007;
    const rp    = r * pulse;
    const alpha = 0.18 + Math.sin(ts*0.0011 + ring.phase) * 0.05;

    const halo = ctx.createRadialGradient(cx, cy, rp*0.90, cx, cy, rp*1.12);
    halo.addColorStop(0, rgb(C.red, alpha*0.72));
    halo.addColorStop(1, rgb(C.red, 0));
    ctx.beginPath(); ctx.arc(cx, cy, rp*1.12, 0, Math.PI*2);
    ctx.fillStyle = halo; ctx.fill();

    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(angle); ctx.translate(-cx, -cy);
    ctx.beginPath(); ctx.arc(cx, cy, rp, 0, Math.PI*2);
    ctx.strokeStyle = rgb(C.red, alpha+0.18); ctx.lineWidth = 0.85;
    ctx.setLineDash([10, 7]); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();

    monoLabel(ctx, S4_LABELS[i], cx, cy - rp - 9, C.red, alpha + 0.38, 7);
  });

  for (let i = 0; i < 8; i++) {
    const t01 = ((ts*0.00026 + i*0.125) % 1 + 1) % 1;
    const ang  = (i*Math.PI*2/8) + ts*0.00015;
    const r    = maxR * (1 - t01*0.76);
    const px   = cx + Math.cos(ang + t01*2.5) * r;
    const py   = cy + Math.sin(ang + t01*2.5) * r;
    const isBurst = S4_RINGS.some(ring => {
      const rR = maxR * ring.f;
      return r < rR*1.07 && r > rR*0.88;
    }) && Math.sin(i*7.9 + ts*0.008) > 0.15;

    if (isBurst) {
      ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI*2);
      ctx.strokeStyle = rgb(C.red, 0.42); ctx.lineWidth = 0.9; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(px, py, 1.9, 0, Math.PI*2);
    ctx.fillStyle = rgb(C.red, 0.78 - t01*0.25); ctx.fill();
  }

  const coreR  = maxR * 0.13;
  const cpulse = 1 + Math.sin(ts*0.002) * 0.07;
  radialGlow(ctx, cx, cy, coreR*3.6, C.white, 0.16);
  ctx.beginPath(); ctx.arc(cx, cy, coreR*cpulse, 0, Math.PI*2);
  ctx.fillStyle = rgb(C.white, 0.93); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, coreR*cpulse*1.28, 0, Math.PI*2);
  ctx.strokeStyle = rgb(C.white, 0.22); ctx.lineWidth = 0.8; ctx.stroke();
}

// ── Scene 5 · Microservices ───────────────────────────────────────────────────
const S5_NODES = [
  { fx:0.50, fy:0.18, col:C.blue,   label:'API'   },
  { fx:0.82, fy:0.42, col:C.green,  label:'DB'    },
  { fx:0.68, fy:0.76, col:C.teal,   label:'CACHE' },
  { fx:0.32, fy:0.76, col:C.blue,   label:'AUTH'  },
  { fx:0.18, fy:0.42, col:C.dim,    label:'SVC'   },
];
const S5_LINKS = [[0,1],[0,2],[0,3],[0,4],[1,2],[3,4],[2,4]];

function scene5(ctx, W, H, ts) {
  dotGrid(ctx, W, H, C.blue, 0.036);
  const cx = W/2, cy = H/2;

  const scaleT     = (ts * 0.000125) % 1;
  const cloneAlpha =
    scaleT < 0.40 ? 0 :
    scaleT < 0.52 ? ease((scaleT-0.40)/0.12) :
    scaleT < 0.88 ? 1 :
    scaleT < 1.00 ? 1 - ease((scaleT-0.88)/0.12) : 0;

  const nodes = S5_NODES.map(n => ({
    ...n,
    x: cx + (n.fx-0.5)*W*0.76,
    y: cy + (n.fy-0.5)*H*0.76,
  }));

  const clone = { x: nodes[0].x + W*0.11, y: nodes[0].y - H*0.03, col: C.blue, label: 'API' };

  function drawNode(n, aScale = 1) {
    const p  = (Math.sin(ts*0.0013 + n.x*0.025 + n.y*0.018) + 1) / 2;
    const nr = (12 + p*2) * Math.max(0.01, aScale);
    radialGlow(ctx, n.x, n.y, nr*2.8, n.col, (0.20 + p*0.10)*aScale);
    ctx.beginPath(); ctx.arc(n.x, n.y, nr, 0, Math.PI*2);
    ctx.fillStyle   = rgb(n.col, (0.12 + p*0.07)*aScale); ctx.fill();
    ctx.strokeStyle = rgb(n.col, (0.44 + p*0.30)*aScale); ctx.lineWidth = 0.9; ctx.stroke();
    const fs = Math.min(7.5, nr * 0.55);
    monoLabel(ctx, n.label, n.x, n.y, n.col, 0.88*aScale, fs);
  }

  S5_LINKS.forEach(([a, b], ei) => {
    const na = nodes[a], nb = nodes[b];
    ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = rgb(C.blue, 0.10); ctx.lineWidth = 0.75; ctx.stroke();

    if (a === 0 && cloneAlpha > 0) {
      ctx.beginPath(); ctx.moveTo(clone.x, clone.y); ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = rgb(C.blue, 0.10*cloneAlpha); ctx.lineWidth = 0.75; ctx.stroke();
    }

    const speed = 0.00054 + ei*0.00007;
    for (let dir = 0; dir < 2; dir++) {
      const t01 = ((ts*speed + ei*0.19 + dir*0.5) % 1 + 1) % 1;
      const [sa, sb] = dir === 0 ? [na, nb] : [nb, na];
      ctx.beginPath();
      ctx.arc(sa.x+(sb.x-sa.x)*t01, sa.y+(sb.y-sa.y)*t01, dir===0 ? 2 : 1.4, 0, Math.PI*2);
      ctx.fillStyle = rgb(dir===0 ? C.blue : C.teal, 0.70); ctx.fill();
    }

    if (a === 0 && cloneAlpha > 0) {
      const t02 = ((ts*speed*1.1 + ei*0.31) % 1 + 1) % 1;
      ctx.beginPath();
      ctx.arc(clone.x+(nb.x-clone.x)*t02, clone.y+(nb.y-clone.y)*t02, 2, 0, Math.PI*2);
      ctx.fillStyle = rgb(C.blue, 0.70*cloneAlpha); ctx.fill();
    }
  });

  nodes.forEach(n => drawNode(n));
  if (cloneAlpha > 0) {
    drawNode(clone, cloneAlpha);
    ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(clone.x, clone.y);
    ctx.strokeStyle = rgb(C.blue, 0.22*cloneAlpha);
    ctx.lineWidth = 0.8; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
  }
}

// ── Scene timing & main draw ──────────────────────────────────────────────────
const SCENES   = [scene1, scene2, scene3, scene4, scene5];
const SCENE_MS = 6200;
const FADE_MS  = 620;

function drawFrame(ctx, W, H, ts) {
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, H);
  const tLocal   = ts % (SCENE_MS * SCENES.length);
  const sceneIdx = Math.floor(tLocal / SCENE_MS) % SCENES.length;
  const sceneMs  = tLocal % SCENE_MS;

  SCENES[sceneIdx](ctx, W, H, ts);

  let fadeAlpha = 0;
  if (sceneMs < FADE_MS)                   fadeAlpha = 1 - sceneMs / FADE_MS;
  else if (sceneMs > SCENE_MS - FADE_MS)   fadeAlpha = (sceneMs - (SCENE_MS - FADE_MS)) / FADE_MS;

  if (fadeAlpha > 0.005) {
    ctx.fillStyle = `rgba(21,18,51,${Math.min(1, fadeAlpha)})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// ── React component ───────────────────────────────────────────────────────────
export default function HeroAnimation() {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    const ctx  = canvas.getContext('2d');

    const resize = () => {
      const w = wrap.offsetWidth, h = wrap.offsetHeight;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const draw = (ts) => {
      resize();
      drawFrame(ctx, canvas.width, canvas.height, ts);
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); };
  }, []);

  return (
    <div ref={wrapRef} style={{ width:'100%', height:'100%', background:NAVY, borderRadius:'inherit', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
    </div>
  );
}
