import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gimnasio.com';
  const password = 'admin123'; // Contraseña temporal
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      nombre: 'Administrador Principal',
      password: hashedPassword,
      rol: 'ADMIN',
    },
  });

  console.log({ admin });

  // Crear configuración inicial si no existe
  const existingConfig = await prisma.configuracion.findFirst();
  if (!existingConfig) {
    await prisma.configuracion.create({
      data: {
        nombreGimnasio: "Gimnasio Demo",
        colorPrimario: "#2563eb", 
        colorSecundario: "#1e40af"
      }
    });
    console.log("Configuración creada");
  }

  // Creación de Socios
  const sociosData = [
    { nombre: 'Juan', apellido: 'Perez', dni: '12345678', email: 'juan.perez@test.com' },
    { nombre: 'Maria', apellido: 'Garcia', dni: '87654321', email: 'maria.garcia@test.com' },
    { nombre: 'Carlos', apellido: 'Lopez', dni: '11223344', email: 'carlos.lopez@test.com' },
    { nombre: 'Ana', apellido: 'Martinez', dni: '44332211', email: 'ana.martinez@test.com' },
  ];

  for (const socio of sociosData) {
    await prisma.socio.upsert({
      where: { dni: socio.dni },
      update: {},
      create: {
        nombre: socio.nombre,
        apellido: socio.apellido,
        dni: socio.dni,
        email: socio.email,
        activo: true
      }
    });
  }
  console.log("Socios creados/verificados");

  // Creación de Planes
  const planesData = [
    { nombre: 'Plan Basico', precio: 3000, duracionMeses: 1, allowsMusculacion: true, allowsCrossfit: false },
    { nombre: 'Plan Trimestral', precio: 8000, duracionMeses: 3, allowsMusculacion: true, allowsCrossfit: false },
    { nombre: 'Plan Crossfit Mensual', precio: 5000, duracionMeses: 1, allowsMusculacion: false, allowsCrossfit: true },
    { nombre: 'Plan Full', precio: 7000, duracionMeses: 1, allowsMusculacion: true, allowsCrossfit: true },
  ];

  for (const plan of planesData) {
    const existingPlan = await prisma.plan.findFirst({
        where: { nombre: plan.nombre }
    });
    
    if (!existingPlan) {
        await prisma.plan.create({
            data: plan
        });
    }
  }
  console.log("Planes creados/verificados");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
