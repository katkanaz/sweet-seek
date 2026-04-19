import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./Router"


const theme = extendTheme({
    colors: {
        primary: "#E8B4B8",
        lightprimary: "#FAF0F1",
        secondary: "#FAE3E3",
        accent: "#F5A9A9",
        darkaccent: "#F07F7F",
        mainbg: "#FFF9F9",
        text: "#4A3C4A",
        grey: "#DAD2DA",
        greyonpink: "#917891",
    },
    styles: {
        global: () => ({
            html: {
                bg: "mainbg",
            },
            body: {
                bg: "mainbg",
            }
        })
    }
})

const queryClient = new QueryClient();

function App() {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default App;
