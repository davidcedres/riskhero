import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStore } from "../state/store";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api";
import Button from "../components/Button";
import Input from "../components/Input";
import sync from "../state/sync";
import Typography from "../components/Typography";
import VStack from "../components/VStack";

const schema = z.object({
    email: z.string().min(1, { message: "Required" }),
    password: z.string().min(1, { message: "Required" }),
});

type Form = {
    email: string;
    password: string;
};

const Signin = () => {
    const { setAuth } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { control, handleSubmit } = useForm<Form>({
        resolver: zodResolver(schema),
    });

    const handleLogin = async (payload: Form) => {
        try {
            setError(false);
            setLoading(true);

            const response = await api.post<string>("/sessions", payload);
            setAuth(response.data);
            sync();

            router.replace("/inspections");
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <View style={styles.root}>
            <VStack>
                <Typography variant="title">Risk Ninja</Typography>
                <Input
                    spellCheck={false}
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    placeholder="usuario"
                    name="email"
                    control={control}
                />
                <Input
                    secureTextEntry={true}
                    passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                    placeholder="contraseña"
                    name="password"
                    control={control}
                />
                <Button
                    loading={loading}
                    onPress={handleSubmit(handleLogin, handleError)}
                >
                    Entrar
                </Button>
            </VStack>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        justifyContent: "center",
        flex: 1,
        padding: 32,
    },
});

export default Signin;
