export interface Area {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: "MANAGER" | "EMPLOYEE";
}

export interface Inspection {
    id: number;
    type: "ANNOUNCED" | "UNANNOUNCED";
    date: Date;
    observations: number[];
    status: "OPEN" | "CLOSED" | "FINALIZED";
    area: Area;
    inspector: User;

    areaId: number;
    userId: number;

    updatedAt: Date;
}

export interface Category {
    id: number;
    name: string;
    conditions: Condition[];
    updatedAt: Date;
}

export interface Condition {
    id: number;
    name: string;
}

export interface Observation {
    id: string;
    state: State;
    description: string;

    inspectionId: number;
    categoryId: number;
    conditionId: number;
}

export interface Evidence {
    filename: string;
    observationId: string;
}

export enum State {
    ACCEPTABLE = "ACCEPTABLE",
    UNSAFE = "UNSAFE",
    MISSING = "MISSING",
    NEEDS_REPAIR = "NEEDS_REPAIR",
    SKIPPED = "SKIPPED",
}

export const getStateLabel = (state: State) => {
    const map = {
        [State.ACCEPTABLE]: "Aceptable",
        [State.UNSAFE]: "No Seguro",
        [State.MISSING]: "No Posee",
        [State.NEEDS_REPAIR]: "Reparar",
        [State.SKIPPED]: "Omitido",
    };

    return map[state];
};

export const getStateColor = (state: State) => {
    const map = {
        [State.ACCEPTABLE]: "#22c55e",
        [State.UNSAFE]: "#eab308",
        [State.MISSING]: "#737373",
        [State.NEEDS_REPAIR]: "#ef4444",
        [State.SKIPPED]: "#64748b",
    };

    return map[state];
};

export const getStateIcon = (state: State) => {
    const map: Record<
        State,
        | "thumbs-up"
        | "alert-triangle"
        | "help-circle"
        | "tool"
        | "more-horizontal"
    > = {
        [State.ACCEPTABLE]: "thumbs-up",
        [State.UNSAFE]: "alert-triangle",
        [State.MISSING]: "help-circle",
        [State.NEEDS_REPAIR]: "tool",
        [State.SKIPPED]: "more-horizontal",
    };

    return map[state];
};
