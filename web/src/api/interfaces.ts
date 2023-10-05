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

export interface InspectionExtended extends Omit<Inspection, 'date'> {
    area: Area
    inspector: User
    date: string
}