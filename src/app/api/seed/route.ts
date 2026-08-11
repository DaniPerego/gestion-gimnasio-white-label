import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if admin already exists
    const existing = await prisma.usuario.findUnique({
      where: { email: 'admin@gimnasio.com' },
    });

    if (existing) {
      return NextResponse.json({ message: 'Admin ya existe, seed no necesario' });
    }

    // Create admin user
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

    // Create default configuration
    await prisma.configuracion.create({
      data: {
        nombreGimnasio: 'Gimnasio Demo',
        colorPrimario: '#2563eb',
        colorSecundario: '#1e40af',
      },
    });

    return NextResponse.json({ message: 'Seed ejecutado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
