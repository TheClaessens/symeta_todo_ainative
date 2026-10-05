import React from 'react';

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
    <div className='w-full max-w-sm'>{children}</div>
  </div>
);

export default Centered;
