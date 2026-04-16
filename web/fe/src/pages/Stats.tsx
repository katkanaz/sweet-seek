import { Alert, Text, AlertDescription, AlertIcon, AlertTitle, Box, Center, Heading, Spinner, Table, TableCaption, Tbody, Td, Th, Thead, Tr, VStack, TableContainer, HStack } from "@chakra-ui/react";
import MainContainer from "../components/MainContainer";
import { useQuery } from "@tanstack/react-query";
import { getStats, GetStatsResponse } from "../api/stats";
import 'chart.js/auto';
import {  Bar, Doughnut } from 'react-chartjs-2'
import { FilterOptions, getFilterOptions } from "../api/computed_structure";
import PopoverDetail from "../components/PopoverDetail";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

type HistBin = {
    start: number,
    end: number,
    count: number,
}

function makeHistogramData(arr: number[], binWidth: number = 1.0): HistBin[] {
    if (arr.length === 0) {
        return [];
    }

    if (binWidth <= 0) {
        console.error(`histogram bin width has to be > 0, got: ${binWidth}`);
        return [];
    }

    const min = Math.min(...arr)
    const max = Math.max(...arr)

    const numBins = Math.ceil((max - min) / binWidth)

    const bins: HistBin[] = Array.from({length: numBins}, (_, i) => ({
        start: min + i * binWidth,
        end: (min + i * binWidth) + binWidth,
        count: 0,
    }));

    for (const v of arr) {
        let idx = Math.floor((v - min) / binWidth);
        if (idx === numBins) { // put max value into last bin
            idx = numBins - 1
        }

        bins[idx].count += 1;
    }

    return bins;
}


function Stats() {

    const { data: stats, isLoading, isError } = useQuery<GetStatsResponse, Error>({
        queryKey: ["stats"],
        queryFn: getStats
    });

    const { data: filterOptions} = useQuery<FilterOptions, Error>({
        queryKey: ["options"],
        queryFn: getFilterOptions
    });

    if (isError) {
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
                            We couldn’t load the statistics. Please try again.
                        </AlertDescription>
                    </Alert>
                </VStack>
            </Center>
        )
    }

    return (
        <MainContainer>
            {isLoading
                ? <Center minH="60vh">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" />
                        <Text fontSize="lg" color="gray.500">
                            Loading statistics...
                        </Text>
                    </VStack>
                </Center>
                : <Box>
                    <Heading as="h1" size="lg" mt="5">Pre-processed Data Statistics</Heading>
                    <Box>TODO: text about what this is</Box>
                    <Box>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus nisi non venenatis vestibulum. Vivamus ac ligula ut lorem viverra vestibulum ac eu nulla. Curabitur aliquet quam vel enim aliquam, vel pharetra dui pulvinar. In vel arcu sollicitudin, facilisis elit id, porttitor justo. Pellentesque lacinia ligula massa. Phasellus a elit tellus. Sed mattis nulla vel interdum lobortis.

                        Nulla egestas massa vel mauris consectetur porta. Donec finibus imperdiet tempus. Vivamus ultrices bibendum magna id placerat. Sed tincidunt odio sed enim tempus, mollis placerat leo malesuada. Proin ut dui id tortor ultricies scelerisque id lobortis lorem. Etiam sit amet urna laoreet, ullamcorper purus et, vehicula magna. Vestibulum consequat nibh vitae porta elementum. Nulla sed mauris nibh. Donec fermentum pharetra odio et fermentum. In volutpat tincidunt feugiat. Nulla vitae velit purus. Etiam faucibus a eros sit amet consectetur. Nullam vel est vel sapien congue faucibus. Etiam vehicula ac urna vel faucibus. Vivamus pellentesque erat at nisl vestibulum condimentum. Quisque eget nisl nec sem semper interdum.
                    </Box>
                    <HStack justify="center">
                        <TableContainer w={["100%", "100%", "100%", "50%"]}>
                            <Table variant='simple'>
                                <TableCaption>Pre-processed data statistics</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Metric</Th>
                                        <Th isNumeric>Value</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>PDB Mirror Date</Td>
                                        <Td isNumeric>{stats?.preproc.pdb_mirror_date}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>PDB Mirror Count</Td>
                                        <Td isNumeric>{stats?.preproc.pdb_mirror_count}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with Sugars</Td>
                                        <Td isNumeric>{stats?.preproc.structs_with_sugars}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with Ligands</Td>
                                        <Td isNumeric>{stats?.preproc.structs_with_ligands}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with Alt Locs</Td>
                                        <Td isNumeric>{stats?.preproc.structs_with_altlocs}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures with Unsupported Alt Locs</Td>
                                        <Td isNumeric>{stats?.preproc.structs_unsupp_altlocs}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Structures After Filter</Td>
                                        <Td isNumeric>{stats?.preproc.structs_after_filter}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>

                    </HStack>


                    <Heading as="h1" size="lg" mt="5">Results Statistics</Heading>

                    <Box>
                        The following statistics were computed using the results displayed on the Results page. The current results were obtained by running the workflow
                        for the following sugars:
                        <PopoverDetail body="Sugar abbreviations as defined by Chemical Component Dictionary (CCD).">
                            <Box
                                display="inline-flex"
                                alignItems="center"
                                cursor="pointer"
                                title="Click to learn more about sugar abbreviations"
                                background="accent"
                                p="1"
                                borderRadius="md"
                            >
                                {filterOptions?.sugars.map(s => s.value).join(", ")}
                                <QuestionOutlineIcon ml="2" w="4" h="4" color="text"/>
                            </Box>
                        </PopoverDetail>.
                    </Box>

                    <Box>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus nisi non venenatis vestibulum. Vivamus ac ligula ut lorem viverra vestibulum ac eu nulla. Curabitur aliquet quam vel enim aliquam, vel pharetra dui pulvinar. In vel arcu sollicitudin, facilisis elit id, porttitor justo. Pellentesque lacinia ligula massa. Phasellus a elit tellus. Sed mattis nulla vel interdum lobortis.

                        Nulla egestas massa vel mauris consectetur porta. Donec finibus imperdiet tempus. Vivamus ultrices bibendum magna id placerat. Sed tincidunt odio sed enim tempus, mollis placerat leo malesuada. Proin ut dui id tortor ultricies scelerisque id lobortis lorem. Etiam sit amet urna laoreet, ullamcorper purus et, vehicula magna. Vestibulum consequat nibh vitae porta elementum. Nulla sed mauris nibh. Donec fermentum pharetra odio et fermentum. In volutpat tincidunt feugiat. Nulla vitae velit purus. Etiam faucibus a eros sit amet consectetur. Nullam vel est vel sapien congue faucibus. Etiam vehicula ac urna vel faucibus. Vivamus pellentesque erat at nisl vestibulum condimentum. Quisque eget nisl nec sem semper interdum.
                    </Box>

                    <Box>
                        <HStack justify="center">
                            <TableContainer w={["100%", "100%", "100%", "50%"]}>
                                <Table variant='simple'>
                                    <TableCaption>Workflow Resutls Statistics</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Metric</Th>
                                            <Th isNumeric>Value</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>Total number of results???</Td>
                                            <Td isNumeric>{stats?.results.num_results}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Total number of found Motif Matches</Td>
                                            <Td isNumeric>{stats?.results.num_motif_matches}</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </HStack>

                        {stats?.results && (
                            <VStack>
                                <Bar
                                    options={{
                                        scales: {
                                            x: { title: { text: "Number of motif matches", display: true } },
                                            y: { title: { text: "Number of proteins", display: true } },
                                        }
                                    }}
                                    data={{
                                        datasets: [{
                                            label: "Number of motif matches per protein",
                                            data: Object.entries(stats.results.motif_matches_per_protein).map(v => ({x: v[0], y: v[1]}))
                                        }],
                                    }}
                                />

                                <Box w="40%">
                                    <Doughnut
                                        data={{
                                            labels: Object.keys(stats.results.motif_matches_per_sugar),
                                            datasets: [{
                                                label: "Number of motif matches per sugar",
                                                data: Object.values(stats.results.motif_matches_per_sugar)
                                            }],
                                        }}
                                    />

                                </Box>

                                <HStack justify="center" w="full">
                                    <TableContainer w={["100%", "100%", "100%", "50%"]}>
                                        <Table variant='simple'>
                                            <TableCaption>Global pLDDT range per sugar</TableCaption>
                                            <Thead>
                                                <Tr>
                                                    <Th w="60%">Sugar</Th>
                                                    <Th isNumeric colSpan={2} textAlign="end">
                                                        Global pLDDT of computed structure
                                                    </Th>
                                                </Tr>
                                                <Tr>
                                                    <Th></Th>
                                                    <Th w="20%" textAlign="end">Min</Th>
                                                    <Th w="20%" textAlign="end">Max</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {Object.entries(stats.results.plddt_range_per_sugar).map(([s, num], i) => (
                                                    <Tr key={i}>
                                                        <Td>{s}</Td>
                                                        <Td isNumeric>{num.min}</Td>
                                                        <Td isNumeric>{num.max}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </HStack>


                                <Bar
                                    options={{
                                        scales: {
                                            x: { 
                                                title: { text: "Global pLDDT", display: true },
                                                type: "linear",
                                                offset: false,
                                                grid: { offset: false },
                                                ticks: { stepSize: 1 }
                                            },
                                            y: {
                                                beginAtZero: true,
                                                title: { text: "Number of computed structures", display: true }
                                            },
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    title: (items) => {
                                                        const x = items[0].parsed.x!;
                                                        return `pLDDT: ${(x - 0.5).toFixed(2)} - ${(x + 0.5).toFixed(2)}`
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    data={{
                                        datasets: [{
                                            label: "Global pLDDT of computed structures",
                                            borderWidth: 1,
                                            barPercentage: 1,
                                            categoryPercentage: 1,
                                            data: makeHistogramData(stats.results.plddt_per_protein).map(b => ({x: (b.end - b.start) / 2 + b.start, y: b.count}))
                                        }],
                                    }}
                                />

                                <Bar
                                    options={{
                                        scales: {
                                            x: { title: { text: "Sugars", display: true } },
                                            y: { title: { text: "Number of surroundings", display: true } },
                                        },
                                    }}
                                    data={{
                                        labels: Object.keys(stats.surroundings),
                                        datasets: [
                                            {
                                                label: "Raw",
                                                data: Object.values(stats.surroundings).map(v => v.raw),
                                            },
                                            {
                                                label: "Filtered",
                                                data: Object.values(stats.surroundings).map(v => v.filtered),
                                            }
                                        ]
                                    }}
                                />


                            </VStack>
                        )}

                    </Box>

                </Box>
            }

        </MainContainer>
    )
}

export default Stats;
