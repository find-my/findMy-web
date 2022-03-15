import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComment, faLock, faN } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  return (
    <main className="mt-16 w-full">
      <h3 className="text-5xl font-nanum-pen-script text-blue-400 text-center">어딨지?</h3>
      <div className="mt-12">
        <div className="flex flex-col items-center ">
          <h5 className="text-lg font-bold mb-3">로그인</h5>
          <form className="flex flex-col w-full  px-20 pt-6 pb-8 mb-4">
            <div>
              <div className="mb-3 relative">
                <div className="mr-1.5 text-2xl absolute left-2 top-1 text-gray-400">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <input
                  className="bg-white shadow appearance-none border  rounded w-full px-10 py-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-400"
                  name="email"
                  type="email"
                  placeholder="이메일"
                />
              </div>
              <div className="mb-3 relative">
                <div className="mr-1.5 text-2xl absolute left-2 top-1 text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <input
                  className="bg-white shadow appearance-none border  rounded w-full px-10 py-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-400"
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            <input
              className=" bg-blue-400 text-center text-white font-semibold py-3 rounded "
              type="submit"
              value="로그인"
            />
            <div className="flex justify-center text-xs mt-2 mb-8">
              <Link href="/">
                <a id="link-signup">아이디 찾기</a>
              </Link>
              <div className="mx-1 text-blue-400">ㅣ</div>
              <Link href="/">
                <a id="link-signup">비밀번호 찾기</a>
              </Link>
              <div className="mx-1 text-blue-400">ㅣ</div>
              <Link href="/">
                <a id="link-signup">회원가입</a>
              </Link>
            </div>

            <ul className="w-full">
              <li className="bg-yellow-400 text-black py-1.5 rounded mt-2">
                <button className="w-full relative">
                  <div className="absolute left-3">
                    <FontAwesomeIcon icon={faComment} size="lg" />
                  </div>
                  <span className="text-center font-semibold">카카오 로그인</span>
                </button>
              </li>
              <li className="bg-green-500 text-white py-1.5 rounded  mt-2">
                <button className="w-full relative">
                  <div className="absolute left-3">
                    <FontAwesomeIcon icon={faN} size="lg" />
                  </div>
                  <span className="text-center font-semibold">네이버 로그인</span>
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </main>
  );
}

/*
  <aside>
        <span className="text-9xl">😵</span>
        <span className="text-6xl">어딨지?</span>
      </aside>

*/
