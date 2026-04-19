import {
    Alert,
    Text,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Center,
    Heading,
    Link as ChakraLink,
    Spinner,
    Table,
    TableCaption,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
    TableContainer,
    HStack,
} from "@chakra-ui/react";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import MainContainer from "../components/MainContainer";
import { useQuery } from "@tanstack/react-query";
import { getStats, GetStatsResponse } from "../api/stats";
import "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { FilterOptions, getFilterOptions } from "../api/computed_structure";
import PopoverDetail from "../components/PopoverDetail";
import { ExternalLinkIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { docsRoute, resultsRoute } from "../Router";

type HistBin = {
    start: number;
    end: number;
    count: number;
};

function makeHistogramData(arr: number[], binWidth: number = 1.0): HistBin[] {
    if (arr.length === 0) {
        return [];
    }

    if (binWidth <= 0) {
        console.error(`histogram bin width has to be > 0, got: ${binWidth}`);
        return [];
    }

    const min = Math.min(...arr);
    const max = Math.max(...arr);

    const numBins = Math.ceil((max - min) / binWidth);

    const bins: HistBin[] = Array.from({ length: numBins }, (_, i) => ({
        start: min + i * binWidth,
        end: min + i * binWidth + binWidth,
        count: 0,
    }));

    for (const v of arr) {
        let idx = Math.floor((v - min) / binWidth);
        if (idx === numBins) {
            // put max value into last bin
            idx = numBins - 1;
        }

        bins[idx].count += 1;
    }

    return bins;
}

function Stats() {
    const {
        data: stats,
        isLoading,
        isError,
    } = useQuery<GetStatsResponse, Error>({
        queryKey: ["stats"],
        queryFn: getStats,
    });

    const { data: filterOptions } = useQuery<FilterOptions, Error>({
        queryKey: ["options"],
        queryFn: getFilterOptions,
    });

    if (isLoading) {
        return (
            <Center minH="60vh">
                <VStack spacing={4}>
                    <Spinner size="xl" thickness="4px" />
                    <Text fontSize="lg" color="gray.500">
                        Loading statistics data...
                    </Text>
                </VStack>
            </Center>
        );
    }
    if (isError || !stats) {
        return (
            <Center minH="60vh">
                <VStack spacing={4}>
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        borderRadius="lg"
                        maxW="md"
                        bgColor="primary"
                    >
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Something went wrong
                        </AlertTitle>
                        <AlertDescription>
                            We couldn't load the statistics. Please try again.
                        </AlertDescription>
                    </Alert>
                </VStack>
            </Center>
        );
    }

    return (
        <MainContainer>
            {isLoading ? (
                <Center minH="60vh">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" />
                        <Text fontSize="lg" color="gray.500">
                            Loading statistics...
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <Box>
                    <Heading as="h1" size="lg" mt="5">
                        Results Statistics
                    </Heading>
                    <HStack align="flex-start" justify="space-between" mt="4">
                        <Box w="60%">
                            <Text>
                                The following statistics were computed using the results displayed
                                on the{" "}
                                <ChakraLink
                                    as={TanstackRouterLink}
                                    to={resultsRoute.to}
                                    target="_blank"
                                    color="darkaccent"
                                >
                                    <HStack alignItems="center" gap="1" display="inline-flex">
                                        <Text>results page</Text>
                                        <ExternalLinkIcon h="3.5" />
                                    </HStack>
                                </ChakraLink>
                                . The current results were obtained by running the workflow for the
                                following sugars:{" "}
                                <Text as="strong" color="darkaccent">
                                    {filterOptions?.sugars.map((s) => s.value).join(", ")}
                                </Text>
                                .
                                <PopoverDetail body="Sugar abbreviations as defined by Chemical Component Dictionary (CCD).">
                                    <QuestionOutlineIcon
                                        ml="1"
                                        w="3.5"
                                        h="3.5"
                                        color="darkaccent"
                                        mb="1"
                                        cursor="pointer"
                                    />
                                </PopoverDetail>
                            </Text>
                            <Text>
                                Total number of results that are displayed on the webpage can be
                                seen in a table on the right. The table also displays the total
                                number of found motif matches in these computed protein structures.
                            </Text>
                        </Box>

                        <TableContainer w="40%">
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Metric</Th>
                                        <Th isNumeric>Value</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Total number of results</Td>
                                        <Td isNumeric>{stats.results.num_results}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Total number of found motif matches</Td>
                                        <Td isNumeric>{stats.results.num_motif_matches}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </HStack>

                    <Box pt="8">
                        Graphs displaying the number of motif matches per protein (left) and the
                        number of motif matches per sugar (right) can be seen bellow.
                    </Box>

                    <HStack align="flex-start" justify="space-between" w="full" mt="8">
                        <Box w="70%">
                            <Bar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                text: "Number of motif matches",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                        },
                                        y: {
                                            title: {
                                                text: "Number of proteins",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    datasets: [
                                        {
                                            label: "Number of motif matches per protein",
                                            data: Object.entries(
                                                stats.results.motif_matches_per_protein,
                                            ).map((v) => ({ x: v[0], y: v[1] })),
                                        },
                                    ],
                                }}
                            />
                        </Box>

                        <Box w="30%">
                            <Doughnut
                                options={{
                                    plugins: {
                                        title: {
                                            text: "Number of motif matches per sugar",
                                            display: true,
                                            font: {
                                                size: 14,
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    labels: Object.keys(stats.results.motif_matches_per_sugar),
                                    datasets: [
                                        {
                                            label: "Number of motif matches per sugar",
                                            data: Object.values(
                                                stats.results.motif_matches_per_sugar,
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </Box>
                    </HStack>

                    <Box mt="8">
                        The table bellow on the left shows the minimum and maximum value of global
                        pLDDT (model confidence) of computed structures of proteins that might
                        possibly bind a given sugar. The graph on the right displays the
                        distribution of global pLDDT values for computed protein structures in the
                        workflow results.
                    </Box>

                    <HStack align="flex-start" justify="space-between" w="full" mt="8">
                        <TableContainer w="35%">
                            <Table variant="simple" size="sm">
                                <TableCaption>
                                    Computed structure global pLDDT range per sugar
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th w="60%">Sugar</Th>
                                        <Th isNumeric colSpan={2} textAlign="end">
                                            Global pLDDT
                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th></Th>
                                        <Th w="20%" textAlign="end">
                                            Min
                                        </Th>
                                        <Th w="20%" textAlign="end">
                                            Max
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Object.entries(stats.results.plddt_range_per_sugar).map(
                                        ([s, num], i) => (
                                            <Tr key={i}>
                                                <Td>{s}</Td>
                                                <Td isNumeric>{num.min}</Td>
                                                <Td isNumeric>{num.max}</Td>
                                            </Tr>
                                        ),
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <Box w="65%">
                            <Bar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                text: "Global pLDDT",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                            type: "linear",
                                            offset: false,
                                            grid: { offset: false },
                                            ticks: { stepSize: 1 },
                                        },
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                text: "Number of computed structures",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                        },
                                    },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                title: (items) => {
                                                    const x = items[0].parsed.x!;
                                                    return `pLDDT: ${(x - 0.5).toFixed(2)} - ${(x + 0.5).toFixed(2)}`;
                                                },
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    datasets: [
                                        {
                                            label: "Global pLDDT of computed structures",
                                            borderWidth: 1,
                                            barPercentage: 1,
                                            categoryPercentage: 1,
                                            data: makeHistogramData(
                                                stats.results.plddt_per_protein,
                                            ).map((b) => ({
                                                x: (b.end - b.start) / 2 + b.start,
                                                y: b.count,
                                            })),
                                        },
                                    ],
                                }}
                            />
                        </Box>
                    </HStack>

                    <Heading as="h1" size="lg" mt="5">
                        Workflow Statistics
                    </Heading>

                    <Box w="full" mt="4">
                        <Text>
                            The following section contains statistics regarding the workflow that
                            produced the results that can be seen on this website. It is recommended
                            to read the Workflow section of the{" "}
                            <ChakraLink
                                as={TanstackRouterLink}
                                to={docsRoute.to}
                                target="_blank"
                                color="darkaccent"
                            >
                                <HStack alignItems="center" gap="1" display="inline-flex">
                                    <Text>documentation</Text>
                                    <ExternalLinkIcon h="3.5" />
                                </HStack>
                            </ChakraLink>{" "}
                            to gain a better understanding of the statistics. Especially to study
                            the steps of the workflow described in the workflow flowchart.
                        </Text>
                        <Text>
                            The table on the left shows the number of protein structures in the
                            individual steps of the workflow. The order of the rows mirrors the
                            order of the steps of the workflow as can be seen in the workflow
                            flowchart. The graph on the right shows the comparison of the number of
                            raw sugar surroundings as returned by PatternQuery and surroundings
                            remaining after filtration. This corresponds to steps 5 and 6 of the
                            workflow flowchart. Filtration removes surroundings which are comprised
                            of less than 5 amino acids.
                        </Text>
                    </Box>
                    <HStack align="flex-start" justify="space-between" mt="8">
                        <TableContainer>
                            <Table variant="simple" size="sm">
                                <TableCaption>Pre-processed data statistics</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Metric</Th>
                                        <Th isNumeric>Value</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Last update of the PDB mirror</Td>
                                        <Td isNumeric>{stats.preproc.pdb_mirror_date}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Total structures in PDB mirror</Td>
                                        <Td isNumeric>{stats.preproc.pdb_mirror_count}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Total structures with Sugars</Td>
                                        <Td isNumeric>{stats.preproc.structs_with_sugars}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with sugars classified as ligands</Td>
                                        <Td isNumeric>{stats.preproc.structs_with_ligands}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            Structures with ligands in alternative <br />{" "}
                                            conformations
                                        </Td>
                                        <Td isNumeric>{stats.preproc.structs_with_altlocs}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            Structures with unsupported <br /> alternative
                                            conformation labels
                                        </Td>
                                        <Td isNumeric>{stats.preproc.structs_unsupp_altlocs}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with ligands after filtering</Td>
                                        <Td isNumeric>{stats.preproc.structs_after_filter}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <Box w="65%">
                            <Bar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                text: "Sugars",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                        },
                                        y: {
                                            title: {
                                                text: "Number of surroundings",
                                                display: true,
                                                font: {
                                                    size: 14,
                                                },
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    labels: Object.keys(stats.surroundings),
                                    datasets: [
                                        {
                                            label: "Raw",
                                            data: Object.values(stats.surroundings).map(
                                                (v) => v.raw,
                                            ),
                                        },
                                        {
                                            label: "Filtered",
                                            data: Object.values(stats.surroundings).map(
                                                (v) => v.filtered,
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </Box>
                    </HStack>
                </Box>
            )}
        </MainContainer>
    );
}

export default Stats;
