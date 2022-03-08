import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export default function Login() {
  return (
    <main className="mt-16">
      <h3 className="text-5xl font-nanum-pen-script text-blue-400 text-center">어딨지?</h3>
      <div className="mt-12">
        <div className="flex flex-col items-center">
          <h5 className="text-sm text-gray-500 font-medium">로그인</h5>
          <form className="flex flex-col">
            <div>
              <fieldset>
                <div>
                  <label id="email">
                    <FontAwesomeIcon icon={faUser} />
                  </label>
                  <input name="email" type="email" placeholder="이메일" required />
                </div>
              </fieldset>
              <fieldset>
                <div>
                  <label id="password">Password</label>
                  <input name="password" type="password" placeholder="비밀번호" />
                </div>
              </fieldset>
            </div>

            <ul>
              <li>
                <button>
                  <Image src="/images/KakaoTalk_logo.png" width="25" height="25" />
                </button>
              </li>
              <li>
                <button>네이버</button>
              </li>
              <li>
                <button>구글</button>
              </li>
            </ul>
            <h1>
              <a id="link-signup">회원가입</a>
            </h1>

            <input type="submit" value="로그인" />
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
