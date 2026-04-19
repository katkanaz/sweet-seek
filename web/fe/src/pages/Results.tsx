import { Box, VStack, Center, Spinner, Text, AlertIcon, Alert, AlertTitle, AlertDescription, Skeleton } from "@chakra-ui/react"
import MainContainer from "../components/MainContainer"
import SearchResultItem from "../components/SearchResultItem"
import { getResults, getFilterOptions, GetComputedStructuresResponse } from "../api/computed_structure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FilterBar from "../components/FilterBar";
import { resultsRoute } from "../Router";
import { useEffect } from "react";
import Pagination from "../components/Pagination";


function clampPageParam(newPage: number, count: number, totalCount: number): number {
    if (newPage <= 0) {
        return 1;
    }

    if (((newPage - 1) * count) + 1 > totalCount) {
        return newPage - 1;
    }
    return newPage;
}

function Results() {
    const searchParams = resultsRoute.useSearch();
    const {sugar, plddt, organism, pdbStructure, title} = searchParams;

    const page = searchParams.page;
    const count = searchParams.count ?? 10;

    const navigate = resultsRoute.useNavigate();

    const { data: results, isLoading, isError } = useQuery<GetComputedStructuresResponse, Error>({
        queryKey: ["results", sugar, plddt, organism, pdbStructure, title, page, count],
        queryFn: () => getResults(searchParams)
    });

    const queryClient = useQueryClient();

    const nextPageEnable = clampPageParam(page + 1, count, results?.total_count ?? 0) === page + 1;
    const prevPageEnable = clampPageParam(page - 1, count, results?.total_count ?? 0) === page - 1;

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ["options"],
            queryFn: getFilterOptions,
            staleTime: 300000, // 5 min
        });
    }, [queryClient]);

    const handleNextPage = () => {
        navigate({
            search: (prev) => ({...prev, page: clampPageParam(prev.page + 1, count, results?.total_count ?? 0)}),
        });
    }

    const handlePrevPage = () => {
        navigate({
            search: (prev) => ({...prev, page: clampPageParam(prev.page - 1, count, results?.total_count ?? 0)}),
        });
    }

    const handleCountChange = (count: number) => {
        console.log(count, "aaaa")
        navigate({
            search: (prev) => ({...prev, page: 1, count: count}),
        });
    }

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
                            We couldn’t load your results. Please try again.
                        </AlertDescription>
                    </Alert>
                </VStack>
            </Center>
        )
    }


    return (
        <MainContainer>
            <VStack pt="4" alignItems="stretch" position="relative">
                <VStack
                    alignItems="flex-start"
                    position="sticky"
                    top="14"
                    background="mainbg"
                    zIndex="500"
                    shadow="0 4px 2px -2px rgba(0,0,0,0.05)"
                    pb="2"
                    pt="2"
                >
                    <FilterBar />
                    <Skeleton isLoaded={!isLoading} width="full">
                        <Pagination
                            page={page}
                            count={count}
                            handlePrev={handlePrevPage}
                            handleNext={handleNextPage}
                            handleCountChange={handleCountChange}
                            totalCount={results?.total_count ?? 0}
                            nextEnabled={nextPageEnable}
                            prevEnabled={prevPageEnable}
                        />
                    </Skeleton>
                </VStack>
                {isLoading
                ? <Center minH="60vh">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" />
                        <Text fontSize="lg" color="gray.500">
                            Loading results...
                        </Text>
                    </VStack>
                </Center>
                : <VStack mt="6" divider={<Box borderBottom="solid" borderBottomColor="grey" color="grey" borderBottomWidth="thin" boxSize="full" w="full"></Box>}>
                    {results?.data.length === 0 &&
                        <Box>
                            No results found
                        </Box>
                    }
                    {results?.data.map(r => <SearchResultItem result={r} />)}
                </VStack>
                }
                <Box borderBottom="solid" borderBottomColor="grey" color="grey" borderBottomWidth="thin" boxSize="full" w="full"></Box>
                    <Skeleton isLoaded={!isLoading} width="full">
                        <Pagination
                            page={page}
                            count={count}
                            handlePrev={handlePrevPage}
                            handleNext={handleNextPage}
                            handleCountChange={handleCountChange}
                            totalCount={results?.total_count ?? 0}
                            nextEnabled={nextPageEnable}
                            prevEnabled={prevPageEnable}
                        />
                    </Skeleton>
            </VStack>
        </MainContainer>
    )
}

export default Results;
