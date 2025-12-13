import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CheckInForm from '@/components/asistencias/check-in-form';
import prisma from '@/lib/prisma';
import { ThemeToggle } from '@/components/theme-toggle';
import { getConfiguracion } from '@/lib/data';

export default async function KioscoPage() {
  const session = await auth();
  const config = await getConfiguracion();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Verificar permiso de asistencias
  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  const canAccess = user?.rol === 'ADMIN' || user?.permisoAsistencias;

  if (!canAccess) {
    redirect('/admin');
  }

  const primaryColor = config?.colorPrimario || '#e74c3c';

  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4"
      style={{ '--primary-color': primaryColor } as React.CSSProperties}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm p-8 shadow-2xl glass-card">
        <div className="mb-6 text-center">
          {config?.logoUrl && (
            <div className="mb-4 flex justify-center">
                <img src={config.logoUrl} alt="Logo" className="h-24 object-contain" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            {config?.nombreGimnasio || 'Control de Acceso'}
          </h1>
          <p className="text-gray-300 text-sm mt-2">Ingrese su DNI para registrar asistencia</p>
        </div>
        <CheckInForm logoUrl={config?.logoUrl} nombreGimnasio={config?.nombreGimnasio} />
      </div>
    </main>
  );
}
