import { Box, Link as ChakraLink, HStack, Text } from "@chakra-ui/react"
import { Link as TanstackRouterLink, useMatchRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { getLastModified, LastUpdated } from "../api/computed_structure";
import { docsRoute, homeRoute, resultDetailRoute, resultsRoute, statsRoute } from "../Router";
import SweetSeekLogo from "../assets/sweet-seek-logo";


function NavBar() {
    const { data: lastUpdated } = useQuery<LastUpdated, Error>({
        queryKey: ["lastModified"],
        queryFn: getLastModified
    });

    const matchRoute = useMatchRoute()
    const nonSticky = matchRoute({to: resultDetailRoute.to});

    return (
        <Box backgroundColor="primary" shadow="sm" h="3.5em" display="flex" justifyContent="space-between" alignItems="center" px="6" top="0" position={!nonSticky ? "sticky": undefined } zIndex="1000">
            <Box>
                <ChakraLink as={TanstackRouterLink} to={homeRoute.to} textDecoration="none" _hover={{ textDecoration: "none" }}>
                    <HStack spacing="2">
                        <Box w="9" h="9" color="text">
                            <SweetSeekLogo />
                        </Box>
                        <Text fontWeight="bold" fontSize="2xl" fontFamily="PT Serif" color="text">
                            SweetSeek
                        </Text>
                    </HStack>
                </ChakraLink>
            </Box>
            {lastUpdated &&
                <>
                    <Box ml="4" height="60%" borderLeft="1px" borderColor="greyonpink"></Box>
                    <Box ml="4" color="greyonpink">
                        Last updated {lastUpdated.date}
                    </Box>
                </>
            }
            <Box flexGrow="1"></Box>
            <HStack spacing="5" className="navlinks">
                <ChakraLink as={TanstackRouterLink} to={homeRoute.to} color="text" fontWeight="bold">
                    Home
                </ChakraLink>
                <ChakraLink as={TanstackRouterLink} to={resultsRoute.to} color="text" fontWeight="bold">
                    Results
                </ChakraLink>
                <ChakraLink as={TanstackRouterLink} to={statsRoute.to} color="text" fontWeight="bold">
                    Statistics
                </ChakraLink>
                <ChakraLink as={TanstackRouterLink} to={docsRoute.to} color="text" fontWeight="bold">
                    Docs
                </ChakraLink>
            </HStack>
        </Box>
    )
}

export default NavBar;
