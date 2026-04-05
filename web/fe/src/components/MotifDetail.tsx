import { Box, Link as ChakraLink, HStack, Table, TableContainer, Tbody, Td, Text, Tr, VStack } from "@chakra-ui/react"
import { ResidueId } from "../api/computed_structure"
import { ExternalLinkIcon } from "@chakra-ui/icons";

type MotifDetailProps = {
    num: number
    sugar: string
    rmsd: number
    residueIds: ResidueId[]
    structurePDB: string
    surroundingResidues: ResidueId[]
}

function MotifDetail({num, sugar, rmsd, residueIds, structurePDB, surroundingResidues}: MotifDetailProps) {
    return (
        <VStack alignItems="flex-start" border="1px" borderColor="rgb(206, 201, 186)">
            <Box background="orange.100" w="full" px="3" py="2">
                Motif {num}
            </Box>
            <Box px="3" pb="2">
                <TableContainer>
                    <Table variant="striped" colorScheme="whiteAlpha" size="sm">
                        <Tbody>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">Sugar:</Td>
                                <Td>
                                    {sugar}
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">RMSD:</Td>
                                <Td>
                                    {rmsd}
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">Motif match residues:</Td>
                                <Td style={{maxWidth: "17rem", textWrap: "auto"}}>
                                   {residueIds.map(i => `${i.res_name} ${i.res_id}/${i.chain_id}`).join(", ")}
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">Original structure PDB ID:</Td>
                                <Td>
                                    <ChakraLink href={`https://www.rcsb.org/structure/${structurePDB}`}>
                                        <HStack alignItems="center" gap="1">
                                            <Text>
                                                {structurePDB}
                                            </Text>
                                            <ExternalLinkIcon />
                                        </HStack>
                                    </ChakraLink>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">Motif residues:</Td>
                                <Td style={{maxWidth: "17rem", textWrap: "auto"}}>
                                   {surroundingResidues.map(i => `${i.res_name} ${i.res_id}/${i.chain_id}`).join(", ")}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </VStack>
    )
}

export default MotifDetail
