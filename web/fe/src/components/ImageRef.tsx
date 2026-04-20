import { Box } from "@chakra-ui/react";

export function ImageRef({ children }: React.PropsWithChildren) {
    return (
        <Box as="span" color="green">{children}</Box>
    );
}
