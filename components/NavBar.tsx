import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar() {
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/logout">
        <a>Logout</a>
      </Link>
    </nav>
  );
}
