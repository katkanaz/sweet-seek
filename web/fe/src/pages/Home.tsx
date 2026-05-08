import {
    Text,
    HStack,
    Heading,
    List,
    ListItem,
    ListIcon,
    VStack,
    Link as ChakraLink,
    Box,
    Skeleton,
} from "@chakra-ui/react";
import MainContainer from "../components/MainContainer";
import { docsRoute, resultsRoute, statsRoute } from "../Router";
import HomeCard from "../components/HomeCard";
import SweetSeekBullet from "../assets/sweet-seek-bullet";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaRegChartBar } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getResultsCount, GetResultsCountResponse } from "../api/computed_structure";

function Home() {
    const { data: resultsCount, isError } = useQuery<GetResultsCountResponse, Error>({
        queryKey: ["results count"],
        queryFn: () => getResultsCount(),
    });

    return (
        <MainContainer>
            <HStack align="flex-start" flexDir={{ base: "column", md: "row" }}>
                <VStack align="start" spacing={4} p={6}>
                    <Heading
                        mt={{ base: "4", md: "12" }}
                        fontWeight="bold"
                        fontFamily="PT Serif"
                        fontSize="4xl"
                        as="h1"
                    >
                        Welcome to{" "}
                        <Box as="span" color="darkaccent">
                            SweetSeek
                        </Box>
                    </Heading>
                    <Box mt="4">
                        An interactive platform for exploring candidate sugar-binding proteins.
                        Discover{" "}
                        <Text as="strong" color="darkaccent">
                            motif matches
                        </Text>{" "}
                        from AlphaFold 2 computed structures using{" "}
                        <Text as="strong" color="darkaccent">
                            motifs
                        </Text>{" "}
                        extracted from known{" "}
                        <Box as="span" whiteSpace="nowrap">
                            sugar-protein
                        </Box>{" "}
                        complexes in the{" "}
                        <ChakraLink href="https://www.rcsb.org/" target="_blank" color="greyonpink">
                            <HStack alignItems="center" gap="0.5" display="inline-flex">
                                <Text as="span">Protein Data Bank (PDB)</Text>
                                <ExternalLinkIcon h="3.5" />
                            </HStack>
                        </ChakraLink>
                    </Box>
                    <List>
                        <ListItem>
                            <Text as="strong" color="darkaccent">
                                Motif:
                            </Text>{" "}
                            A processed surrounding of a sugar within 5 Å (5-10 residues)
                        </ListItem>
                        <ListItem>
                            <Text as="strong" color="darkaccent">
                                Motif match:
                            </Text>{" "}
                            A matching motif found in a computed structure
                        </ListItem>
                    </List>
                    <Text>The website makes it possible to:</Text>

                    <List spacing={2}>
                        {[
                            "Browse and filter candidate sugar-binding proteins",
                            "Visualize protein computed structures",
                            "Inspect 3D alignmnets of motifs and motif matches",
                            "Explore statistics about the results",
                        ].map((item) => (
                            <ListItem key={item}>
                                <ListIcon as={SweetSeekBullet} color="accent" />
                                {item}
                            </ListItem>
                        ))}
                    </List>
                    <Box
                        borderBottom="solid"
                        borderBottomColor="grey"
                        color="grey"
                        borderBottomWidth="thin"
                        boxSize="full"
                        w="full"
                        mt="8"
                    ></Box>
                    <VStack alignItems="flex-start" mt="3">
                        <Box color="text" fontWeight="bold" fontSize="xl">Database Overview</Box>
                        <HStack spacing={{base: "3", md: "6"}} alignItems="flex-start" mt="1">
                            {!isError && (
                                <VStack alignItems="flex-start" spacing={0} maxW="28">
                                    <Skeleton isLoaded={!!resultsCount}>
                                        <Box fontWeight="bold" fontSize={{base: "lg", md: "3xl"}}>
                                            {resultsCount?.total_count}
                                        </Box>
                                    </Skeleton>
                                    <Box fontSize={{base: "xs", md: "md"}} color="greyonpink">
                                        <Box as="span" whiteSpace="nowrap">
                                            Identified
                                        </Box>{" "}
                                        Proteins
                                    </Box>
                                </VStack>
                            )}
                            <VStack alignItems="flex-start" spacing={0} maxW="32">
                                <Box fontWeight="bold" fontSize={{base: "lg", md: "3xl"}}>
                                    PDB
                                </Box>
                                <Box fontSize={{base: "xs", md: "md"}} color="greyonpink">
                                    Motifs from known structures
                                </Box>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0} maxW="28">
                                <Box fontWeight="bold" fontSize={{base: "lg", md: "3xl"}}>
                                    AFDB
                                </Box>
                                <Box fontSize={{base: "xs", md: "md"}} color="greyonpink">
                                    Matches in AlphaFold DB
                                </Box>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <Box fontWeight="bold" fontSize={{base: "lg", md: "3xl"}}>
                                    RMSD
                                </Box>
                                <Box fontSize={{base: "xs", md: "md"}} color="greyonpink">
                                    Match Evaluation
                                </Box>
                            </VStack>
                        </HStack>
                    </VStack>
                </VStack>
                <VStack w="full" spacing="4" p={6} mt={{ base: "4", md: "12" }}>
                    <HomeCard
                        color="accent"
                        cardTitle="Explore the Results"
                        cardText="Browse and filter candidate sugar-binding proteins"
                        route={resultsRoute.to}
                        actionText="Go to Results"
                        icon={<FaSearch />}
                    />
                    <HomeCard
                        color="secondary"
                        cardTitle="See Result Statistics"
                        cardText="View statistics about the results"
                        route={statsRoute.to}
                        actionText="Go to Statistics"
                        icon={<FaRegChartBar />}
                    />
                    <HomeCard
                        color="primary"
                        cardTitle="Learn More"
                        cardText="About the website and methodology"
                        route={docsRoute.to}
                        actionText="Go to Documentation"
                        icon={<FaRegFileLines />}
                    />
                </VStack>
            </HStack>
        </MainContainer>
    );
}

export default Home;
