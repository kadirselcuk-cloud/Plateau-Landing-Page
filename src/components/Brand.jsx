import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Plateau">
      <BrandMark />
      <span>Plateau</span>
    </Link>
  );
}
