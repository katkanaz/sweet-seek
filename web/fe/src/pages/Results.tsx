import { SearchIcon } from "@chakra-ui/icons"
import { InputGroup, InputLeftElement, Input, InputRightElement, Box, Kbd, VStack, Center, Spinner, Text, AlertIcon, Alert, AlertTitle, AlertDescription } from "@chakra-ui/react"
import MainContainer from "../components/MainContainer"
import SearchResultItem from "../components/SearchResultItem"

import { getResults, ComputedStructure, getFilterOptions } from "../api/computed_structure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useRef, useState } from "react";
import FilterBar from "../components/FilterBar";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { resultsRoute } from "../Router";
import { useEffect } from "react";


function Results() {

    const filters = resultsRoute.useSearch()
    const {sugar, plddt, organism, pdbStructure} = filters;


    const { data: resultsList, isLoading, isError } = useQuery<ComputedStructure[], Error>({
        queryKey: ["results", sugar, plddt, organism, pdbStructure],
        queryFn: () => getResults(filters)
    });

    const queryClient = useQueryClient();

    useEffect(() => { // TODO: check if this loads before filterbar starts rendering
        queryClient.prefetchQuery({
            queryKey: ["options"],
            queryFn: getFilterOptions,
            staleTime: 300000, // 5 min
        });
    }, []);

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
                <VStack mt="6" divider={<Box borderBottom="solid" borderBottomColor="lightgrey" borderBottomWidth="thin" boxSize="full" w="full"></Box>}>
                    {resultsList?.length === 0 &&
                        <Box>
                            No results found
                        </Box>
                    }
                    {resultsList?.map(r => <SearchResultItem result={r} />)}
                </VStack>
            </VStack>
        </MainContainer>
    )
}

// TODO: how many results displayed overall, choose how many on page + go to next page

export default Results
