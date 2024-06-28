export type Group = 1 | 2 | 3 | 4 | 5 | 6

export interface AlumnEntry {
    id_alumn: number,
    name: string,
    age: number,
    group: Group
}

export type NonSensitiveInfo =  Pick<AlumnEntry, "id_alumn" | "group">

export type OmitInfo = Omit<AlumnEntry, "group">