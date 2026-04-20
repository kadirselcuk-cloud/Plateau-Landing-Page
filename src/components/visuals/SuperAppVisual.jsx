export default function SuperAppVisual() {
  const tiles = ['Bank', 'Grocery', 'Fuel', 'Health', 'Travel', 'Fitness', 'Parking', 'Dining'];
  return (
    <div className="viz viz-superapp">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-head">
            <div className="ph-logo"><span className="brand-mark" style={{ width: 14, height: 14 }} /></div>
            <div className="ph-title">SuperApp</div>
            <div className="ph-avatar" />
          </div>
          <div className="phone-card">
            <div className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,.7)' }}>TOTAL BALANCE</div>
            <div className="phone-balance">₺ 48.240<span>,00</span></div>
          </div>
          <div className="phone-tiles">
            {tiles.map((tl, i) => (
              <div key={i} className="phone-tile">
                <div className="pt-icon" />
                <div>{tl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="superapp-side">
        <div className="mono label-caps">PARTNERS</div>
        <div className="sa-list">
          {['Partner · 01', 'Partner · 02', 'Partner · 03', 'Partner · 04'].map((p, i) => (
            <div key={i} className="sa-row">
              <div className="sa-sq" />
              <div>{p}</div>
              <div className="mono sa-ok">active</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
