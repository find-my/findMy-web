interface LayoutProps {
  children: React.ReactNode;
  authType: string;
}

export default function authLayout({ children, authType }: LayoutProps) {
  return (
    <main className="mt-16 w-full">
      <h3 className="text-5xl font-nanum-pen-script text-blue-400 text-center">어딨지?</h3>
      <div className="mt-12">
        <div className="flex flex-col items-center ">
          <h5 className="text-lg font-bold mb-3">{authType}</h5>
          {children}
        </div>
      </div>
    </main>
  );
}
