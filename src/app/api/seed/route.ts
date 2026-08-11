import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const results: string[] = [];

    // Create admin if not exists
    const existing = await prisma.usuario.findUnique({
      where: { email: 'admin@gimnasio.com' },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.usuario.create({
        data: {
          email: 'admin@gimnasio.com',
          nombre: 'Administrador Principal',
          password: hashedPassword,
          rol: 'ADMIN',
          permisoSocios: true,
          permisoPlanes: true,
          permisoSuscripciones: true,
          permisoAsistencias: true,
          permisoReportes: true,
          permisoConfiguracion: true,
          permisoUsuarios: true,
          permisoTransacciones: true,
        },
      });
      results.push('Admin creado');
    } else {
      results.push('Admin ya existía');
    }

    // Create config if not exists
    const config = await prisma.configuracion.findFirst();
    if (!config) {
      await prisma.configuracion.create({
        data: {
          nombreGimnasio: 'Gimnasio Demo',
          colorPrimario: '#2563eb',
          colorSecundario: '#1e40af',
        },
      });
      results.push('Configuración creada');
    } else {
      results.push('Configuración ya existía');
    }

    return NextResponse.json({ message: results.join(', ') });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
