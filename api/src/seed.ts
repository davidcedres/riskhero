import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'

dotenv.config()

const prisma = new PrismaClient()

const organization = await prisma.organization.create({
    data: {
        name: 'Universidad De Los Andes'
    }
})

await prisma.user.create({
    data: {
        email: 'david@riskninja.io',
        name: 'David Cedres',
        role: 'MANAGER',
        organizationId: organization.id,
        password: hashSync('Password.1', Number(process.env.SALT!)),
        updatedAt: new Date()
    }
})

const baseEntities = [
    {
        category: 'Piso',
        conditions: [
            'Huecos - Desniveles',
            'Orden y limpieza',
            'Demarcación de Áreas'
        ]
    },
    {
        category: 'Paredes',
        conditions: ['Pintura', 'Grietas', 'Huecos', 'Filtraciones']
    },
    {
        category: 'Techo',
        conditions: ['Pintura', 'Huecos - Grietas', 'Filtraciones']
    },
    {
        category: 'Iluminación',
        conditions: ['Natural', 'Lámparas', 'Tubos Fluorecentes']
    },
    {
        category: 'Ventilación',
        conditions: ['Natural', 'Forzada (Mecánica)']
    },
    {
        category: 'Salubridad Básica',
        conditions: ['Baños', 'Vestuarios', 'Sala comedor', 'Filtros de agua']
    },
    {
        category: 'Instalaciones y Servicios Básicos',
        conditions: [
            'Agua para Uso Industrial',
            'Sistema Eléctrico',
            'Aire Comprimido',
            'Redes Telefónicas',
            'Drenajes',
            'Tuberías en General'
        ]
    },
    {
        category: 'Instalaciones Eléctricas',
        conditions: [
            'Codificación de Tableros',
            'Senalización de Tableros',
            'Enumeración de Interruptores',
            'Protección de Instalación Electrica'
        ]
    },
    {
        category: 'Sistemas y Equipos de Seguridad',
        conditions: [
            'Sistema de Detección y Alarmas Contra Incendios',
            'Extintores Portátiles',
            'Medios de Escape',
            'Lámparas de Emergencia',
            'Senalización de Higiene y Seguridad',
            'Equipos de Protección Personal',
            'Kit de Primeros Auxilios'
        ]
    },
    {
        category: 'Mobiliario y Equipos de Oficina',
        conditions: [
            'Escritorio',
            'Silla',
            'Mesa de Computadora o de Trabajo',
            'Monitor',
            'Herramientas de Oficina o de Trabajo',
            'Distancia entre Mobiliario de Oficina y/o Trabajo',
            'Área de Trabajo'
        ]
    }
]

const conditions = [
    ...new Set(baseEntities.flatMap(({ conditions }) => conditions))
]

await Promise.all(
    conditions.map((condition) =>
        prisma.condition.create({
            data: {
                name: condition,
                updatedAt: new Date()
            }
        })
    )
)

for (const { conditions, category } of baseEntities) {
    const conditionsQuery = await prisma.condition.findMany({
        where: {
            name: {
                in: conditions
            }
        }
    })

    const ids = conditionsQuery.map((condition) => condition.id)

    await prisma.category.create({
        data: {
            name: category,
            conditions: {
                connect: ids.map((id) => ({ id }))
            },
            updatedAt: new Date()
        }
    })
}
