interface Props {
  title: string;
  canGoBack: boolean;
  hasTab: boolean;
  children: React.ReactNode;
}

export default function Layout({ title, canGoBack, hasTab, children }: Props) {
  return (
    <div>
      <div className="bg-white w-full"></div>
      {children}
      {hasTab ? <nav></nav> : null}
    </div>
  );
}
