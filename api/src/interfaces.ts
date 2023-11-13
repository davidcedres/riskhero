export interface User {
    id: number
    email: string
    name: string
    role: 'MANAGER' | 'EMPLOYEE' | 'ADMIN'
    password: string
    organizationId: number
}
