import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import {
    Area,
    Category,
    Condition,
    Inspection,
    Observation,
    State,
    User,
    getStateColor,
    getStateTranslation,
} from "../../api/interfaces";
import api from "../../api/api";
import {
    Anchor,
    Badge,
    Breadcrumbs,
    Button,
    Image,
    Modal,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { useState } from "react";
import colors from "../../colors";

const randomImage =
    "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww";

const NewReport = () => {
    // HOOKS
    const { state } = useLocation();
    const inspectionId = Number(state.inspectionId);

    // STATE
    const [evidence, setEvidence] = useState(false);

    // QUERIES
    const inspectionRequest = useQuery(["FetchInspection", inspectionId], () =>
        api.get<Inspection & { area: Area; inspector: User; date: string }>(
            "/inspections/" + inspectionId
        )
    );

    const observationsRequest = useQuery(
        ["FetchObservations", inspectionId],
        () =>
            api.get<(Observation & { condition: Condition })[]>(
                `/observations`,
                {
                    params: { inspectionId },
                }
            )
    );

    const categoriesRequest = useQuery(["FetchCategories"], () =>
        api.get<Category[]>(`/categories`)
    );

    if (
        observationsRequest.data === undefined ||
        categoriesRequest.data === undefined ||
        inspectionRequest.data === undefined
    )
        return null;

    const observations = observationsRequest.data.data;
    const categories = categoriesRequest.data.data;
    const inspection = inspectionRequest.data.data;

    return (
        <Stack>
            <Breadcrumbs>
                <Anchor component={Link} to="/reports">
                    Reportes
                </Anchor>

                <Anchor component={Link} to="#">
                    Nuevo
                </Anchor>
            </Breadcrumbs>

            <Stack gap="0">
                <Title my="md">Nuevo Reporte</Title>
                <Text>
                    Para la inspección llevada acabo en{" "}
                    <strong>{inspection.area.name}</strong>
                </Text>
            </Stack>

            {categories.map((category) => {
                const badObservations = observations.filter(
                    (observation) =>
                        [
                            State.MISSING,
                            State.NEEDS_REPAIR,
                            State.UNSAFE,
                        ].includes(observation.state) &&
                        observation.categoryId === category.id
                );

                if (badObservations.length === 0) return;

                return (
                    <Stack>
                        <Title size="h2">{category.name}</Title>

                        {badObservations.map((observation) => (
                            <Stack>
                                <Title size="h3">
                                    {observation.condition.name}
                                </Title>

                                <Badge
                                    size="lg"
                                    color={
                                        colors[
                                            getStateColor(observation.state)
                                        ]["500"]
                                    }
                                >
                                    {getStateTranslation(observation.state)}
                                </Badge>

                                <Text fs="italic">
                                    {observation.description}
                                </Text>

                                <Image
                                    src={randomImage}
                                    maw={128}
                                    mah={128}
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: 4,
                                    }}
                                    onClick={() => setEvidence(true)}
                                />

                                <Textarea
                                    label="Analisis"
                                    minRows={5}
                                    autosize
                                    required
                                    placeholder={`Escriba su análisis sobre el estado de ${category.name}: ${observation.condition.name}.`}
                                />
                            </Stack>
                        ))}
                    </Stack>
                );
            })}

            <Textarea
                label="Conclusión final"
                minRows={5}
                autosize
                required
                placeholder="Escriba sus comentarios de cierre para finalizar el reporte."
            />

            <Button color="black" style={{ alignSelf: "flex-end" }}>
                Guardar Cambios
            </Button>

            <Modal
                opened={evidence}
                onClose={() => setEvidence(false)}
                withCloseButton={false}
                centered
            >
                <Image src={randomImage} maw={512} mah={512} />
            </Modal>
        </Stack>
    );
};

export default NewReport;
