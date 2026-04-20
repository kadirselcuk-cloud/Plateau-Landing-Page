import phone1 from '../../assets/superapp-phone-1.png';
import phone2 from '../../assets/superapp-phone-2.png';
import phone3 from '../../assets/superapp-phone-3.png';
import app1 from '../../assets/miniapp-1.png';
import app2 from '../../assets/miniapp-2.png';
import app3 from '../../assets/miniapp-3.png';

const PAIRS = [
  [phone1, app1],
  [phone2, app2],
  [phone3, app3],
];

export default function SuperAppPhones() {
  return (
    <div className="superapp-phones">
      {PAIRS.map(([phone, app], i) => (
        <div key={i} className="phone-wrap">
          <img src={app} alt="" className="phone-screen" />
          <img src={phone} alt="" className="phone-frame" />
        </div>
      ))}
    </div>
  );
}
