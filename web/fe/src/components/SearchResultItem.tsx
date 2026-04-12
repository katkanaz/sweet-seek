import { HStack, Image, Link as ChakraLink, Table, TableContainer, Tbody, Td, Tr, VStack, Box, Text } from "@chakra-ui/react";
import { Link as TanstackRouterLink } from '@tanstack/react-router'
import { ComputedStructure } from "../api/computed_structure";
import { ExternalLinkIcon } from "@chakra-ui/icons";


interface SearchResultItemProps {
    result: ComputedStructure
};

function SearchResultItem({result}: SearchResultItemProps) {
    return (
        <HStack align="flex-start" w="full" spacing={4}>
            <Box boxSize="250px" flexShrink={0} alignItems="center" display="flex">
                <ChakraLink  as={TanstackRouterLink} to={result.afdb_id}>
                    <Image src={`api/img/preview/${result.pdb_id}.jpeg`} borderRadius="md" mixBlendMode="multiply" />
                </ChakraLink>
            </Box>
            <VStack align="left-start" spacing={3} flex="1" minW={0}>
                <ChakraLink as={TanstackRouterLink} to={result.afdb_id} fontSize="2xl" fontWeight="bold" w="full">
                    {result.title}
                </ChakraLink>
                <TableContainer w="full" m={0}>
                    <Table variant="striped" colorScheme="whiteAlpha" size="sm">
                        <Tbody>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">Organism</Td>
                                {/* FIXME: for link taxon id needed */}
                                <Td>
                                    <Text>
                                        {result.organism}
                                    </Text>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">AlphaFold DB</Td>
                                <Td>
                                {/* FIXME: why is the link so "long" */}
                                    <ChakraLink href={`https://alphafold.ebi.ac.uk/entry/${result.afdb_id.split("-")[1]}`} target="_blank">
                                        <HStack alignItems="center" gap="1">
                                            <Text>
                                                {result.afdb_id}
                                            </Text>
                                            <ExternalLinkIcon />
                                        </HStack>
                                    </ChakraLink>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">UniProtKB</Td>
                                <Td>
                                    <ChakraLink href={`https://www.uniprot.org/uniprotkb/${result.afdb_id.split("-")[1]}`} target="_blank">
                                        <HStack alignItems="center" gap="1">
                                            <Text>
                                                {`${result.afdb_id.split("-")[1]}`}
                                            </Text>
                                                <ExternalLinkIcon />
                                        </HStack>
                                    </ChakraLink>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">pLDDT (global)</Td>
                                <Td>
                                    {result.plddt}
                                </Td>
                            </Tr>
                            {result.best_match &&
                                <Tr>
                                    <Td width="2" fontWeight="bold" px="0">Best Motif Match</Td>
                                    <Td>
                                        Sugar: {result.best_match.sugar}, RMSD: {result.best_match.rmsd}
                                    </Td>
                                </Tr>
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        </HStack>
    )
}

export default SearchResultItem;
