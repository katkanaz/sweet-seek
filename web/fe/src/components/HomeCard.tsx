import { Text, Link as ChakraLink, VStack, Box, HStack } from "@chakra-ui/react";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa6";
import { JSX } from "react";

interface HomeCardProps {
    color: string;
    cardTitle: string;
    cardText: string;
    route: string;
    actionText: string;
    icon: JSX.Element;

}

function HomeCard({ color, cardTitle, cardText, route, actionText, icon }: HomeCardProps) {
    return (
        <ChakraLink as={TanstackRouterLink} to={route} w={{ base: "full", md: "90" }} _hover={{textDecoration: "none"}}>
            <VStack
                background={color}
                w={{ base: "full", md: "90" }}
                h="48"
                borderRadius="lg"
                padding="5"
                color="text"
                alignItems="flex-start"
                _hover={{shadow: "md"}}
                transition="all 300ms"
                className="group"
            >
                <Box p="2" rounded="md" borderColor="text" border="1px">
                    {icon}
                </Box>
                <Text fontWeight="bold" fontSize="xl">
                    {cardTitle}
                </Text>
                <Text fontSize="sm">{cardText}</Text>
                <Box flexGrow="1"></Box>
                <HStack transition="all 300ms" opacity="0" _groupHover={{opacity: "100%"}}>
                    <Box>{actionText}</Box>
                    <FaArrowRight />
                </HStack>
            </VStack>
        </ChakraLink>
    );
}

export default HomeCard;
