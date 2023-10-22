export interface User {
    id: number
    email: string
    name: string
    role: 'MANAGER' | 'EMPLOYEE'
    password: string
    organizationId: number
}
