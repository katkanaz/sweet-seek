import { Box, VStack, Center, Spinner, Text, AlertIcon, Alert, AlertTitle, AlertDescription } from "@chakra-ui/react"
import MainContainer from "../components/MainContainer"
import SearchResultItem from "../components/SearchResultItem"

import { getResults, getFilterOptions, GetComputedStructuresResponse } from "../api/computed_structure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FilterBar from "../components/FilterBar";
import { resultsRoute } from "../Router";
import { useEffect } from "react";
import Pagination from "../components/Pagination";


function Results() {
    const searchParams = resultsRoute.useSearch();
    const {sugar, plddt, organism, pdbStructure} = searchParams;

    const page = searchParams.page;
    const count = searchParams.count ?? 10;

    const navigate = resultsRoute.useNavigate();

    const { data: results, isLoading, isError } = useQuery<GetComputedStructuresResponse, Error>({
        queryKey: ["results", sugar, plddt, organism, pdbStructure, page, count],
        queryFn: () => getResults(searchParams)
    });

    const queryClient = useQueryClient();

    useEffect(() => { // TODO: check if this loads before filterbar starts rendering
        queryClient.prefetchQuery({
            queryKey: ["options"],
            queryFn: getFilterOptions,
            staleTime: 300000, // 5 min
        });
    }, []);

    const handleNextPage = () => {
        navigate({
            search: (prev) => ({...prev, page: prev.page + 1}),
        });
    }

    const handlePrevPage = () => {
        navigate({
            search: (prev) => ({...prev, page: prev.page - 1}),
        });
    }

    const handleCountChange = (count: number) => {
        console.log(count, "aaaa")
        navigate({
            search: (prev) => ({...prev, page: 1, count: count}),
        });
    }


    if (isLoading) { // TODO: only show loader in the body, always render filter bar
        return (
            <Center minH="60vh">
                <VStack spacing={4}>
                    <Spinner size="xl" thickness="4px" />
                    <Text fontSize="lg" color="gray.500">
                        Loading results...
                    </Text>
                </VStack>
            </Center>
        )
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
            <VStack pt="4" alignItems="stretch">
                <FilterBar />
                <Pagination page={page} count={count} handlePrev={handlePrevPage} handleNext={handleNextPage} handleCountChange={handleCountChange} totalCount={results?.total_count ?? 0} />
                <VStack mt="6" divider={<Box borderBottom="solid" borderBottomColor="lightgrey" borderBottomWidth="thin" boxSize="full" w="full"></Box>}>
                    {results?.data.length === 0 &&
                        <Box>
                            No results found
                        </Box>
                    }
                    {results?.data.map(r => <SearchResultItem result={r} />)}
                </VStack>
                <Pagination page={page} count={count} handlePrev={handlePrevPage} handleNext={handleNextPage} handleCountChange={handleCountChange} totalCount={results?.total_count ?? 0} />
            </VStack>
        </MainContainer>
    )
}

// TODO: how many results displayed overall, choose how many on page + go to next page

export default Results
