import ProfesorPanel from '@/components/asistencias/profesor-panel';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.rol) {
    redirect('/login');
  }

  let discipline = '';
  switch (session.user.rol) {
    case 'PROFESOR_MUSCULACION':
      discipline = 'musculacion';
      break;
    case 'PROFESOR_CROSSFIT':
      discipline = 'crossfit';
      break;
    case 'PROFESOR_FUNCIONAL':
      discipline = 'funcional';
      break;
    default:
      redirect('/admin');
  }

  return <ProfesorPanel discipline={discipline} />;
}
