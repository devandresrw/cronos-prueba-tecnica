'use client';

import { usePathname } from 'next/navigation';
import CronosLogoMemo from '@/components/utils/LogoCronos';
import { logoutAction } from '@/actions/auth.actions';
import { CiLogout } from "react-icons/ci";


export default function Header() {
  const pathname = usePathname();
  const isForoPage = pathname === '/foro';

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className='flex justify-between items-center pt-5 px-5'>
      <div className="w-60 h-20">
        <CronosLogoMemo />
      </div>
      
      {isForoPage && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          title="Cerrar sesión"
        >
          <CiLogout size={24} />
        </button>
      )}
    </header>
  );
}