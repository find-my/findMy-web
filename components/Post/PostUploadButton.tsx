import Link from 'next/link';
import { useRouter } from 'next/router';

function PostUploadButton() {
  const router = useRouter();
  return (
    <Link href={router.pathname + '/upload'}>
      <button
        onClick={() => console.log('click')}
        className="fixed bottom-16 right-2 hover:bg-blue-500 transition-colors p-2 text-white bg-blue-400 rounded-full"
      >
        <svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </Link>
  );
}

export default PostUploadButton;
