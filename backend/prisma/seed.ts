import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Comida' },
      { name: 'Transporte' },
      { name: 'Vivienda' },
      { name: 'Entretenimiento' },
      { name: 'Salud' },
      { name: 'Educación' },
      { name: 'Ropa' },
      { name: 'Viajes' },
      { name: 'Otros' }
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })