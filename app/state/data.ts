import { merge } from 'lodash'
import { nanoid } from 'nanoid'
import {
    Area,
    Category,
    CategoryCondition,
    Condition,
    Inspection,
    User,
} from './interfaces'

// FACTORIES & HELPERS
const withId = <T extends { id: string }>(base: Omit<T, 'id'>): T =>
    merge({ id: nanoid() }, base) as T

const makeUser = (name: string): User => ({
    id: nanoid(),
    email: name.split(' ')[0] + '@ula.com.ve',
    name,
    role: 'EMPLOYEE',
})

const makeInspection = (areaIndex: number, userIndex: number): Inspection => ({
    id: nanoid(),
    areaId: data__areas[areaIndex].id,
    userId: data__users[userIndex].id,
    type: 'ANNOUNCED',
    date: new Date(),
    observations: [],
    status: 'OPEN',
})

// MOCKED DATE FOR APP DEMO
export const data__users = [
    makeUser('Juan Garcia'),
    makeUser('Manuel Linares'),
    makeUser('Carlos Fonseca'),
    makeUser('Maria Perez'),
    makeUser('David Contreras'),
    makeUser('Carolina Gonzalez'),
    makeUser('Mario Oliveira'),
    makeUser('Alejandro Sulbaran'),
]

export const data__areas = [
    withId<Area>({ name: 'Laboratorio de Computacion' }),
    withId<Area>({ name: 'Laboratorio de Biologia' }),
    withId<Area>({ name: 'Sala de Radiacion - HULA' }),
    withId<Area>({ name: 'Cancha de Voleibol - Hechicera' }),
    withId<Area>({ name: 'Comedor Universitario Nucleo Hechicera' }),
    withId<Area>({ name: 'Aserradero - La Mata' }),
]

export const data__inspections = [
    makeInspection(2, 3),
    makeInspection(0, 1),
    makeInspection(3, 2),
]

export const data__categories = [
    withId<Category>({ name: 'Piso' }),
    withId<Category>({ name: 'Paredes' }),
    withId<Category>({ name: 'Techo' }),
    withId<Category>({ name: 'Iluminación' }),
    withId<Category>({ name: 'Ventilación' }),
    withId<Category>({ name: 'Salubridad Básica' }),
    withId<Category>({ name: 'Instalaciones y Servicios Básicos' }),
    withId<Category>({ name: 'Instalaciones Eléctricas' }),
    withId<Category>({ name: 'Sistemas y Equipos de Seguridad' }),
    withId<Category>({ name: 'Mobiliario y Equipos de Oficina' }),
]

export const data__conditions = [
    withId<Condition>({ name: 'Huecos' }),
    withId<Condition>({ name: 'Orden y limpieza' }),
    withId<Condition>({ name: 'Demarcación de Áreas' }),
    withId<Condition>({ name: 'Pintura' }),
    withId<Condition>({ name: 'Grietas' }),
    withId<Condition>({ name: 'Desniveles' }),
    withId<Condition>({ name: 'Filtraciones' }),
    withId<Condition>({ name: 'Natural' }),
    withId<Condition>({ name: 'Lámparas' }),
    withId<Condition>({ name: 'Tubos Fluorecentes' }),
    withId<Condition>({ name: 'Natural' }),
    withId<Condition>({ name: 'Forzada (Mecánica)' }),
    withId<Condition>({ name: 'Baños' }),
    withId<Condition>({ name: 'Vestuarios' }),
    withId<Condition>({ name: 'Sala comedor' }),
    withId<Condition>({ name: 'Filtros de agua' }),
    withId<Condition>({ name: 'Agua para Uso Industrial' }),
    withId<Condition>({ name: 'Sistema Eléctrico' }),
    withId<Condition>({ name: 'Aire Comprimido' }),
    withId<Condition>({ name: 'Redes Telefónicas' }),
    withId<Condition>({ name: 'Drenajes' }),
    withId<Condition>({ name: 'Tuberías en General' }),
    withId<Condition>({ name: 'Codificación de Tableros' }),
    withId<Condition>({ name: 'Senalización de Tableros' }),
    withId<Condition>({ name: 'Enumeración de Interruptores' }),
    withId<Condition>({ name: 'Protección de Instalación Electrica' }),
    withId<Condition>({
        name: 'Sistema de Detección y Alarmas Contra Incendios',
    }),
    withId<Condition>({ name: 'Extintores Portátiles' }),
    withId<Condition>({ name: 'Medios de Escape' }),
    withId<Condition>({ name: 'Lámparas de Emergencia' }),
    withId<Condition>({ name: 'Senalización de Higiene y Seguridad' }),
    withId<Condition>({ name: 'Equipos de Protección Personal' }),
    withId<Condition>({ name: 'Kit de Primeros Auxilios' }),
    withId<Condition>({ name: 'Escritorio' }),
    withId<Condition>({ name: 'Silla' }),
    withId<Condition>({ name: 'Mesa de Computadora o de Trabajo' }),
    withId<Condition>({ name: 'Monitor' }),
    withId<Condition>({ name: 'Herramientas de Oficina o de Trabajo' }),
    withId<Condition>({
        name: 'Distancia entre Mobiliario de Oficina y/o Trabajo',
    }),
    withId<Condition>({ name: 'Área de Trabajo' }),
]

export const data__categoryConditions: CategoryCondition[] = [
    {
        category: 'Piso',
        conditions: [
            'Huecos',
            'Desniveles',
            'Orden y limpieza',
            'Demarcación de Áreas',
        ],
    },
    {
        category: 'Paredes',
        conditions: ['Pintura', 'Grietas', 'Huecos', 'Filtraciones'],
    },
    {
        category: 'Techo',
        conditions: ['Pintura', 'Huecos', 'Grietas', 'Filtraciones'],
    },
    {
        category: 'Iluminación',
        conditions: ['Natural', 'Lámparas', 'Tubos Fluorecentes'],
    },
    {
        category: 'Ventilación',
        conditions: ['Natural', 'Forzada (Mecánica)'],
    },
    {
        category: 'Salubridad Básica',
        conditions: ['Baños', 'Vestuarios', 'Sala comedor', 'Filtros de agua'],
    },
    {
        category: 'Instalaciones y Servicios Básicos',
        conditions: [
            'Agua para Uso Industrial',
            'Sistema Eléctrico',
            'Aire Comprimido',
            'Redes Telefónicas',
            'Drenajes',
            'Tuberías en General',
        ],
    },
    {
        category: 'Instalaciones Eléctricas',
        conditions: [
            'Codificación de Tableros',
            'Senalización de Tableros',
            'Enumeración de Interruptores',
            'Protección de Instalación Electrica',
        ],
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
            'Kit de Primeros Auxilios',
        ],
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
            'Área de Trabajo',
        ],
    },
].flatMap((item) =>
    item.conditions.map((condition) => ({
        id: nanoid(),
        categoryId: data__categories.find(
            (category) => category.name === item.category
        )?.id!,
        conditionId: data__conditions.find((c) => c.name === condition)?.id!,
    }))
)

data__categoryConditions.some((cc) => {
    if (cc.categoryId === undefined || cc.conditionId === undefined)
        throw new Error('Bad combinations were found')
})
