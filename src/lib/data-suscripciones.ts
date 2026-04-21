import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 10;

export async function fetchSuscripciones(query: string, currentPage: number, filtro?: string) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const now = new Date();
  const next7Days = new Date(now);
  next7Days.setDate(next7Days.getDate() + 7);

  const whereCondition: any = {
    OR: [
      { socio: { nombre: { contains: query, mode: 'insensitive' } } },
      { socio: { apellido: { contains: query, mode: 'insensitive' } } },
      { socio: { dni: { contains: query, mode: 'insensitive' } } },
    ],
  };

  if (filtro === 'vencidas') {
    whereCondition.fechaFin = { lt: now };
  } else if (filtro === 'por-vencer') {
    whereCondition.fechaFin = { gte: now, lte: next7Days };
  }

  try {
    const suscripciones = await prisma.suscripcion.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      where: whereCondition,
      include: {
        socio: true,
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Convertir Decimal a number para evitar error de serialización
    return suscripciones.map(s => ({
      ...s,
      plan: {
        ...s.plan,
        precio: Number(s.plan.precio)
      }
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subscriptions.');
  }
}

export async function fetchSuscripcionesPages(query: string, filtro?: string) {
  noStore();
  const now = new Date();
  const next7Days = new Date(now);
  next7Days.setDate(next7Days.getDate() + 7);

  const whereCondition: any = {
    OR: [
      { socio: { nombre: { contains: query, mode: 'insensitive' } } },
      { socio: { apellido: { contains: query, mode: 'insensitive' } } },
      { socio: { dni: { contains: query, mode: 'insensitive' } } },
    ],
  };

  if (filtro === 'vencidas') {
    whereCondition.fechaFin = { lt: now };
  } else if (filtro === 'por-vencer') {
    whereCondition.fechaFin = { gte: now, lte: next7Days };
  }

  try {
    const count = await prisma.suscripcion.count({
      where: whereCondition,
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of subscriptions.');
  }
}

export async function fetchSuscripcionById(id: string) {
  noStore();
  try {
    const suscripcion = await prisma.suscripcion.findUnique({
      where: { id },
      include: {
        socio: true,
        plan: true,
      },
    });

    if (!suscripcion) return null;

    return {
      ...suscripcion,
      plan: {
        ...suscripcion.plan,
        precio: Number(suscripcion.plan.precio),
      },
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subscription.');
  }
}
