import 'react-native-get-random-values'
import { keyBy, merge } from 'lodash'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
    Area,
    Category,
    CategoryCondition,
    Condition,
    Evidence,
    Inspection,
    Observation,
    User,
} from './interfaces'
import {
    data__areas,
    data__categories,
    data__categoryConditions,
    data__conditions,
    data__inspections,
    data__users,
} from './data'

// entities that do not have a particular order to follow/display
// do not have an ids array
interface State {
    auth: {
        logged: boolean
    }
    areas: {
        index: Record<string, Area>
        ids: string[]
    }
    users: {
        index: Record<string, User>
        ids: string[]
    }
    inspections: {
        index: Record<string, Inspection>
        ids: string[]
    }
    categories: {
        index: Record<string, Category>
        ids: string[]
    }
    conditions: {
        index: Record<string, Condition>
    }
    categoryConditions: {
        index: Record<string, CategoryCondition>
        ids: string[]
    }
    observations: {
        index: Record<string, Observation>
        ids: string[]
    }
    evidences: {
        index: Record<string, Evidence>
        ids: string[]
    }
}

interface Actions {
    setLogged: (logged: boolean) => void
    createArea: (area: Omit<Area, 'id'>) => void
    createInspection: (inspection: Omit<Inspection, 'id'>) => void
    closeInspection: (inspectionId: string) => void
    createObservation: (observation: Omit<Observation, 'id'>) => void
    createEvidence: (evidence: Omit<Evidence, 'id'>) => void
}

export const useStore = create(
    immer<State & Actions>((set) => ({
        auth: {
            logged: false,
        },

        setLogged: (logged) =>
            set((state) => {
                state.auth.logged = logged
            }),

        areas: {
            index: keyBy(data__areas, 'id'),
            ids: data__areas.map((area) => area.id),
        },

        createArea: (area) =>
            set((state) => {
                const id = nanoid()
                state.areas.index[id] = merge(area, { id })
                state.areas.ids.push(id)
            }),

        users: {
            index: keyBy(data__users, 'id'),
            ids: data__users.map((user) => user.id),
        },

        inspections: {
            index: keyBy(data__inspections, 'id'),
            ids: data__inspections.map((inspection) => inspection.id),
        },

        createInspection: (inspection) =>
            set((state) => {
                const id = nanoid()
                state.inspections.index[id] = merge(inspection, { id })
                state.inspections.ids.push(id)
            }),

        closeInspection: (id) =>
            set((state) => {
                state.inspections.index[id].status = 'CLOSED'
            }),

        categories: {
            index: keyBy(data__categories, 'id'),
            ids: data__categories.map((category) => category.id),
        },

        conditions: {
            index: keyBy(data__conditions, 'id'),
        },

        categoryConditions: {
            index: keyBy(data__categoryConditions, 'id'),
            ids: data__categoryConditions.map((cc) => cc.id),
        },

        observations: {
            index: {},
            ids: [],
        },

        createObservation: (observation) =>
            set((state) => {
                const id = nanoid()
                state.observations.index[id] = merge(observation, { id })
                state.observations.ids.push(id)
            }),

        evidences: {
            index: {},
            ids: [],
        },

        createEvidence: (evidence) =>
            set((state) => {
                const id = nanoid()
                state.evidences.index[id] = merge(evidence, { id })
                state.evidences.ids.push(id)
            }),
    }))
)
