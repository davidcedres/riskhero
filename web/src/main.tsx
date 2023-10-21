import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import {
    ClerkProvider,
    RedirectToSignIn,
    SignedIn,
    SignedOut,
} from "@clerk/clerk-react";
import Welcome from "./pages/Welcome.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { startCase } from "lodash";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (error) => {
                if (!(error instanceof AxiosError)) {
                    toast.error("Oops");
                    return;
                }

                (
                    error.response?.data[0].errors.issues as {
                        code: string;
                        message: string;
                        path: string[];
                    }[]
                ).forEach((issue) => {
                    toast.error(
                        `${startCase(issue.path[0])}: ${issue.message}`
                    );
                });
            },
        },
    },
});

const myTheme = createTheme({
    primaryColor: "indigo",
    defaultRadius: 8,
    components: {
        Title: {
            defaultProps: {
                // fz: 99,
                fw: 800,
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={myTheme}>
                <ClerkProvider publishableKey={clerkPubKey}>
                    <SignedIn>
                        <Welcome />
                    </SignedIn>
                    <SignedOut>
                        <RedirectToSignIn />
                    </SignedOut>
                </ClerkProvider>
            </MantineProvider>
        </QueryClientProvider>
        <Toaster position="bottom-left" />
    </React.StrictMode>
);
