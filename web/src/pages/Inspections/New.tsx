import {
    Anchor,
    Breadcrumbs,
    Button,
    Select,
    Stack,
    Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import api from "../../api/api";
import { useMemo } from "react";
import { Area, Inspection, User } from "../../api/interfaces";
import toast from "react-hot-toast";

const items = [
    { title: "Inspecciones", to: "/inspections" },
    { title: "Nueva", to: "#" },
].map((item, index) => (
    <Anchor component={Link} to={item.to} key={index}>
        {item.title}
    </Anchor>
));

interface Form {
    area: string;
    inspector: string;
    type: Inspection["type"];
    date: Date;
}

const schema = yup
    .object({
        area: yup.string().required(),
        inspector: yup.string().required(),
        type: yup.string().oneOf(["ANNOUNCED", "UNANNOUNCED"]).required(),
        date: yup.date().required(),
    })
    .required();

const NewInspection = () => {
    const navigate = useNavigate();

    const { handleSubmit, control } = useForm<Form>({
        resolver: yupResolver(schema),
    });

    const areasRequest = useQuery(["FetchAreas"], () =>
        api.get<Area[]>("/areas")
    );
    const usersRequest = useQuery(["FetchUsers"], () =>
        api.get<User[]>("/users")
    );
    const saveRequest = useMutation(
        (data: Omit<Inspection, "id" | "observations">) =>
            api.post("/inspections", data)
    );

    const areas = useMemo(
        () => areasRequest.data?.data ?? [],
        [areasRequest.data?.data]
    );

    const users = useMemo(
        () => usersRequest.data?.data ?? [],
        [usersRequest.data?.data]
    );

    const onSubmit = async (data: Form) => {
        await saveRequest.mutateAsync({
            ...data,
            areaId: Number(data.area),
            userId: Number(data.inspector),
            status: "OPEN",
        });

        navigate("/", {
            replace: true,
        });

        toast.success("Inspección guardada");
    };

    return (
        <Stack>
            <Breadcrumbs>{items}</Breadcrumbs>
            <Title>Nueva Inspección</Title>

            <Controller
                name="area"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Area"
                        placeholder="Seleccione area a inspeccionar"
                        data={areas.map((area) => ({
                            value: String(area.id),
                            label: area.name,
                        }))}
                    />
                )}
            />

            <Controller
                name="inspector"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Inspector"
                        placeholder="Seleccione un inspector"
                        data={users.map((user) => ({
                            value: String(user.id),
                            label: user.name,
                        }))}
                    />
                )}
            />

            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Tipo"
                        placeholder="Tipo de inspección"
                        data={[
                            {
                                value: "ANNOUNCED",
                                label: "Anunciada",
                            },
                            {
                                value: "UNANNOUNCED",
                                label: "No Anunciada",
                            },
                        ]}
                    />
                )}
            />

            <Controller
                name="date"
                control={control}
                render={({ field }) => (
                    <DateTimePicker
                        {...field}
                        label="Fecha y hora"
                        placeholder="Fecha y hora de la inspección"
                    />
                )}
            />

            <Button onClick={handleSubmit(onSubmit)}>Guardar</Button>
        </Stack>
    );
};

export default NewInspection;
