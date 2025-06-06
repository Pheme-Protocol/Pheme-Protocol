import { NextPage } from 'next';
import Link from 'next/link';

const Custom404: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404; 