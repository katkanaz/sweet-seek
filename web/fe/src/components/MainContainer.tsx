import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface MainContainerProps {
    width?: string | string[] | object;
    children?: ReactNode | ReactNode[];
}

function MainContainer({
    children,
    width = { base: "100%", lg: "90%", xl: "80%", "2xl": "65%" },
}: MainContainerProps) {
    return (
        <Box as="main" display="flex" justifyContent="center" mb="5" color="text" bg="inherit">
            <Box width={width}>{children}</Box>
        </Box>
    );
}

export default MainContainer;
