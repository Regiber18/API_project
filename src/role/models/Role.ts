export interface Role { 
    role_id: number | null
    personal_id: number | null
    management: boolean
    teacher: boolean
    escolarControl: boolean
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    deleted: boolean
}
