import React from 'react';
import ServiceLogo from '@components/ServiceLogo';
interface LayoutProps {
  children: React.ReactNode;
  authType: string;
}

function authLayout({ children, authType }: LayoutProps) {
  return (
    <main className="mt-16 w-full">
      <ServiceLogo textSize="text-5xl" />
      <div className="mt-12">
        <div className="flex flex-col items-center ">
          <h5 className="text-lg font-bold mb-3">{authType}</h5>
          {children}
        </div>
      </div>
    </main>
  );
}

export default React.memo(authLayout);
