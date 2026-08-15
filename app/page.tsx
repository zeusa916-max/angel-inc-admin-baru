import { Metadata } from 'next';
import StorefrontView from '@/components/storefront/storefront-view';

export const metadata: Metadata = {
  title: 'ANGEL INC. — Premium Fragrance, Beauty & Fashion',
  description:
    'Temukan wewangian parfum mewah, body mist, body care, dan fashion elegan khas ANGEL INC. Made in Paradise.',
  openGraph: {
    title: 'ANGEL INC. — Premium Fragrance & Fashion',
    description: 'Fragrance, beauty, and fashion designed to become part of your everyday story.',
  },
};

export default function HomePage() {
  return <StorefrontView />;
}
