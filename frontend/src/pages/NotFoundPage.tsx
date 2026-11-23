import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-500 mt-4">Ye page maujood nahi hai</p>
      <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline">
        ← Dashboard pe wapas jayein
      </Link>
    </div>
  );
}

export default NotFoundPage;