import { Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import { Link as TanstackRouterLink } from "@tanstack/react-router";

interface HomeCardProps {
    color: string;
    cardText: string;
    route: string;
}

function HomeCard({ color, cardText, route }: HomeCardProps) {
    return (
        <ChakraLink as={TanstackRouterLink} to={route}>
            <Box
                background={color}
                w="44"
                h="40"
                borderRadius="lg"
                fontSize="xl"
                padding="5"
                color="text"
            >
                <Text fontWeight="bold">{cardText}</Text>
            </Box>
        </ChakraLink>
    );
}

export default HomeCard;
