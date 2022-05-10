interface SubmitProps {
  value: string;
}

export default function Submit({ value }: SubmitProps) {
  return (
    <input className=" bg-blue-400 text-center text-white font-semibold py-3 rounded " type="submit" value="로그인" />
  );
}
