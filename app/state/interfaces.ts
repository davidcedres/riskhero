export interface Area {
    id: string
    name: string
}

export interface User {
    id: string
    email: string
    name: string
    role: 'MANAGER' | 'EMPLOYEE'
}

export interface Inspection {
    id: string
    areaId: string
    userId: string
    type: 'ANNOUNCED' | 'UNANNOUNCED'
    date: Date
    observations: number[]
    status: 'OPEN' | 'CLOSED' | 'FINALIZED'
}

export interface Category {
    id: string
    name: string
}

export interface Condition {
    id: string
    name: string
}

export interface CategoryCondition {
    id: string
    categoryId: string
    conditionId: string
}

export interface Observation {
    id: string
    inspectionId: string
    categoryId: string
    conditionId: string
    state: State
    description: string
}

export interface Evidence {
    id: string
    data: string
    observationId: string
}

export interface Report {
    id: string
    inspectionId: string
    status: 'OPEN' | 'CLOSED' | 'ARCHIVED'
}

export enum State {
    ACCEPTABLE,
    UNSAFE,
    MISSING,
    NEEDS_REPAIR,
}

export const getStateLabel = (state: State) => {
    const map = {
        [State.ACCEPTABLE]: 'Aceptable',
        [State.UNSAFE]: 'No Seguro',
        [State.MISSING]: 'No Posee',
        [State.NEEDS_REPAIR]: 'Reparar',
    }

    return map[state]
}

export const getStateColor = (state: State) => {
    const map = {
        [State.ACCEPTABLE]: '#22c55e',
        [State.UNSAFE]: '#eab308',
        [State.MISSING]: '#737373',
        [State.NEEDS_REPAIR]: '#ef4444',
    }

    return map[state]
}

export const getStateIcon = (state: State) => {
    const map: Record<
        State,
        'thumbs-up' | 'alert-triangle' | 'help-circle' | 'tool'
    > = {
        [State.ACCEPTABLE]: 'thumbs-up',
        [State.UNSAFE]: 'alert-triangle',
        [State.MISSING]: 'help-circle',
        [State.NEEDS_REPAIR]: 'tool',
    }

    return map[state]
}
