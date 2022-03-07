// index.html
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/Head";
interface HeaderProps {
  title?: string;
}
function Header({ title }: HeaderProps) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function HomePage() {
  const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"];

  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <div className="bg-red-500">
        <h1 className="text-black">it works</h1>
      </div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <Image
        src="/images/vercel.svg"
        width={400}
        height={400}
        alt="Your Name"
      />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <h1 className="title">
        Read{" "}
        <Link href="/posts/first-post">
          <a>this page!</a>
        </Link>
      </h1>
      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}
