import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Brand({ variant = 'red' }) {
  return (
    <Link to="/" className="brand" aria-label="Plateau">
      <BrandMark variant={variant} />
      <span>Plateau</span>
    </Link>
  );
}
