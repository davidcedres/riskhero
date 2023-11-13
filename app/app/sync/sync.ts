import { Category, Inspection, State } from '../../state/interfaces'
import { isAfter } from 'date-fns'
import { keyBy, merge, omit, values } from 'lodash'
import { useStore } from '../../state/store'
import api from '../../api/api'
import * as FileSystem from 'expo-file-system'

/*
Data synchronization:

Remote State and Local State might differ.

Local State must not be overwritten by remote one, otherwise important
work might be lost.

Possible Algorithm:
   - Download all remote inspections
   - Find all local inspections where the corresponding remote one has an updatedAt older than ours
   - Replace remote entities
   END
*/
const sync = async () => {
    const store = useStore.getState()

    console.log('App will sync')

    try {
        store.setSyncing(true)
        console.log('Pushing')
        await push()

        console.log('Pulling')
        await pull()
    } catch (error) {
        console.log('Synced was not successful')
        console.log(error)
    } finally {
        store.setSyncing(false)
    }
}

const push = async () => {
    const store = useStore.getState()

    const { data: remote } = await api.get<
        (Inspection & { date: string; updatedAt: string })[]
    >('/inspections')

    const remoteIndex = keyBy(remote, 'id')
    const local = values(store.inspections.index)

    // find every local inspection who has a remote version with an older signature
    const toPush = local.filter((inspection) =>
        isAfter(
            new Date(inspection.updatedAt),
            new Date(remoteIndex[inspection.id].updatedAt)
        )
    )

    for (const inspection of toPush) {
        // we filter the offline observations for each unsynced inspection
        const observations = values(store.observations.index).filter(
            (observation) => observation.inspectionId === inspection.id
        )

        for (const observation of observations) {
            console.log(`Observation ${observation.id}`)

            const {
                data: { id: observationId }
            } = await api.post<{ id: number }>(
                '/observations',
                omit(observation, 'id')
            )

            console.log(`Observation ${observationId} synced ✅`)

            if (
                observation.state === State.ACCEPTABLE ||
                observation.state === State.SKIPPED
            ) {
                console.log('Skipping Evidence 👀')
                continue
            }

            const evidence = values(store.evidences.index).find(
                (evidence) => evidence.observationId === observation.id
            )

            if (evidence === undefined)
                throw new Error(
                    'Found negative observation with no evidence, this should not happen ever'
                )

            if (FileSystem.documentDirectory === null)
                throw new Error('App has no access to document directory')

            await FileSystem.uploadAsync(
                'http://localhost:3030/evidences',
                FileSystem.documentDirectory + 'evidences/' + evidence.filename,
                {
                    fieldName: 'file',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    parameters: {
                        observationId: String(observationId)
                    },
                    headers: {
                        Authorization: 'Bearer ' + store.auth.token
                    }
                }
            )

            console.log('Evidence Synced ✅')

            // delete our local evidence to keep the storage low
            await FileSystem.deleteAsync(
                FileSystem.documentDirectory + `evidences/` + evidence.filename
            )

            console.log('Evidence Deleted From Document Directory ✅')
        }

        await api.patch(`/inspections/${inspection.id}`, {
            status: 'CLOSED'
        })

        console.log('Inspection Marked As Closed ✅')
    }
}

const pull = async () => {
    const store = useStore.getState()

    const { data: inspections } = await api.get<
        (Inspection & { date: string; updatedAt: string })[]
    >('/inspections')

    store.setInspections(
        inspections.map((inspection) =>
            merge(inspection, {
                date: new Date(inspection.date),
                updatedAt: new Date(inspection.updatedAt)
            })
        )
    )

    const { data: categories } = await api.get<
        (Category & { updatedAt: string })[]
    >('/categories')

    store.setCategories(
        categories.map((category) =>
            merge(category, { updatedAt: new Date(category.updatedAt) })
        )
    )
}

export default sync
