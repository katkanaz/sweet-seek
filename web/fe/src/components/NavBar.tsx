import {
    Box,
    Link as ChakraLink,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack,
    IconButton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Link as TanstackRouterLink, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getLastModified, LastUpdated } from "../api/computed_structure";
import { docsRoute, homeRoute, resultDetailRoute, resultsRoute, statsRoute } from "../Router";
import SweetSeekLogo from "../assets/sweet-seek-logo";
import { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

function NavBar() {
    const { data: lastUpdated } = useQuery<LastUpdated, Error>({
        queryKey: ["lastModified"],
        queryFn: getLastModified,
    });

    const matchRoute = useMatchRoute();
    const nonSticky = matchRoute({ to: resultDetailRoute.to });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const onClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <Box
            backgroundColor="primary"
            shadow="sm"
            h="3.5em"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px="6"
            top="0"
            position={!nonSticky ? "sticky" : undefined}
            zIndex="1000"
        >
            <Box>
                <ChakraLink
                    as={TanstackRouterLink}
                    to={homeRoute.to}
                    textDecoration="none"
                    _hover={{ textDecoration: "none" }}
                >
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
            {lastUpdated && (
                <Flex
                    flexDir="row"
                    h="full"
                    justify="center"
                    align="center"
                    display={{ base: "none", md: "flex" }}
                >
                    <Box ml="4" height="60%" borderLeft="1px" borderColor="greyonpink"></Box>
                    <Box ml="4" color="greyonpink">
                        Last updated {lastUpdated.date}
                    </Box>
                </Flex>
            )}
            <Box flexGrow="1"></Box>
            <HStack spacing="5" className="navlinks" display={{ base: "none", md: "flex" }}>
                <ChakraLink
                    as={TanstackRouterLink}
                    to={homeRoute.to}
                    color="text"
                    fontWeight="bold"
                >
                    Home
                </ChakraLink>
                <ChakraLink
                    as={TanstackRouterLink}
                    to={resultsRoute.to}
                    color="text"
                    fontWeight="bold"
                >
                    Results
                </ChakraLink>
                <ChakraLink
                    as={TanstackRouterLink}
                    to={statsRoute.to}
                    color="text"
                    fontWeight="bold"
                >
                    Statistics
                </ChakraLink>
                <ChakraLink
                    as={TanstackRouterLink}
                    to={docsRoute.to}
                    color="text"
                    fontWeight="bold"
                >
                    Docs
                </ChakraLink>
            </HStack>

            <IconButton
                aria-label="Navigation menu"
                onClick={() => setIsDrawerOpen(true)}
                icon={<HamburgerIcon />}
                variant="outline"
                borderColor="text"
                display={{ base: "block", md: "none" }}
            />

            <Drawer placement="top" onClose={onClose} isOpen={isDrawerOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        <HStack spacing="2">
                            <Box w="9" h="9" color="text">
                                <SweetSeekLogo />
                            </Box>
                            <Text
                                fontWeight="bold"
                                fontSize="2xl"
                                fontFamily="PT Serif"
                                color="text"
                            >
                                SweetSeek
                            </Text>

                            {lastUpdated && (
                                <>
                                    <Box flexGrow="1"></Box>
                                    <Flex
                                        flexDir="row"
                                        h="full"
                                        justify="center"
                                        align="center"
                                        fontSize="sm"
                                        color="greyonpink"
                                        flexWrap="wrap"
                                        justifyContent="flex-end"
                                        columnGap="1"
                                    >
                                        <Box color="greyonpink" fontSize="sm" whiteSpace="wrap">
                                            Last updated
                                        </Box>
                                        <Box as="span" whiteSpace="nowrap">
                                            {lastUpdated.date}
                                        </Box>
                                    </Flex>
                                </>
                            )}
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack
                            spacing="5"
                            className="navlinks"
                            align="flex-start"
                            onClick={onClose}
                        >
                            <ChakraLink
                                as={TanstackRouterLink}
                                to={homeRoute.to}
                                color="text"
                                fontWeight="bold"
                            >
                                Home
                            </ChakraLink>
                            <ChakraLink
                                as={TanstackRouterLink}
                                to={resultsRoute.to}
                                color="text"
                                fontWeight="bold"
                            >
                                Results
                            </ChakraLink>
                            <ChakraLink
                                as={TanstackRouterLink}
                                to={statsRoute.to}
                                color="text"
                                fontWeight="bold"
                            >
                                Statistics
                            </ChakraLink>
                            <ChakraLink
                                as={TanstackRouterLink}
                                to={docsRoute.to}
                                color="text"
                                fontWeight="bold"
                            >
                                Docs
                            </ChakraLink>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}

export default NavBar;
