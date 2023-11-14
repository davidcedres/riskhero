export interface Area {
    id: number
    name: string
}

export interface User {
    id: number
    email: string
    name: string
    role: 'MANAGER' | 'EMPLOYEE'
}

export interface Inspection {
    id: number
    areaId: number
    userId: number
    type: 'ANNOUNCED' | 'UNANNOUNCED'
    date: Date
    observations: number[]
    status: 'OPEN' | 'CLOSED' | 'DONE'
}

export interface Report {
    id: number
    conclusion: string
    inspection: Inspection & {
        area: Area
        inspector: User
        date: string
    }
    inspectionId: number
    url?: string
}

export interface Category {
    id: number
    name: string
    conditions: Condition[]
    updatedAt: Date
}

export interface Condition {
    id: number
    name: string
}

export interface Observation {
    id: number
    state: State
    description: string
    analysis?: string

    inspectionId: number
    categoryId: number
    conditionId: number
}

export interface Evidence {
    id: number
    key: string
    observationId: number
    updatedAt: string
    url: string
}

export enum State {
    ACCEPTABLE = 'ACCEPTABLE',
    UNSAFE = 'UNSAFE',
    MISSING = 'MISSING',
    NEEDS_REPAIR = 'NEEDS_REPAIR',
    SKIPPED = 'SKIPPED'
}

export const getStateColor = (state: State) => {
    const map: Record<State, 'green' | 'red' | 'slate'> = {
        [State.ACCEPTABLE]: 'green',
        [State.UNSAFE]: 'red',
        [State.MISSING]: 'red',
        [State.NEEDS_REPAIR]: 'red',
        [State.SKIPPED]: 'slate'
    }

    return map[state]
}

export const getStateTranslation = (state: State) => {
    const map: Record<
        State,
        | 'Aceptable'
        | 'Inseguro'
        | 'Faltante'
        | 'Necesita Reparacion'
        | 'Omitido'
    > = {
        [State.ACCEPTABLE]: 'Aceptable',
        [State.UNSAFE]: 'Inseguro',
        [State.MISSING]: 'Faltante',
        [State.NEEDS_REPAIR]: 'Necesita Reparacion',
        [State.SKIPPED]: 'Omitido'
    }

    return map[state]
}
