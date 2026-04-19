import {
    Box,
    Button,
    Link as ChakraLink,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { ResidueId } from "../api/computed_structure";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type MotifDetailProps = {
    num: number;
    sugar: string;
    rmsd: number;
    residueIds: ResidueId[];
    structurePDB: string;
    surroundingResidues: ResidueId[];
    enableAlign: boolean;
    handleAlignClick: () => void;
};

function MotifDetail({
    num,
    sugar,
    rmsd,
    residueIds,
    structurePDB,
    surroundingResidues,
    enableAlign,
    handleAlignClick,
}: MotifDetailProps) {
    return (
        <VStack alignItems="flex-start" border="1px" borderColor="accent">
            <HStack background="accent" w="full" px="3" py="2" justifyContent="space-between">
                <Text color="text">Motif Match {num}</Text>
                <Button
                    variant="outline"
                    borderColor="text"
                    textColor="text"
                    background="accent"
                    disabled={!enableAlign}
                    onClick={() => handleAlignClick()}
                >
                    Align
                </Button>
            </HStack>
            <Box px="3" pb="2">
                <TableContainer>
                    <Table variant="striped" colorScheme="whiteAlpha" size="sm">
                        <Tbody>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">
                                    Sugar:
                                </Td>
                                <Td>{sugar}</Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">
                                    RMSD:
                                </Td>
                                <Td>{rmsd}</Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">
                                    Motif match residues:
                                </Td>
                                <Td style={{ maxWidth: "17rem", textWrap: "auto" }}>
                                    {residueIds
                                        .map((i) => `${i.res_name} ${i.res_id}/${i.chain_id}`)
                                        .join(", ")}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Box background="accent" w="full" px="3" h="7" py="1">
                <Text color="text" fontSize="sm">
                    Original Motif
                </Text>
            </Box>
            <Box px="3" pb="2">
                <TableContainer>
                    <Table variant="striped" colorScheme="whiteAlpha" size="sm">
                        <Tbody>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">
                                    Original structure PDB ID:
                                </Td>
                                <Td>
                                    <ChakraLink
                                        href={`https://www.rcsb.org/structure/${structurePDB}`}
                                        target="_blank"
                                    >
                                        <HStack alignItems="center" gap="1">
                                            <Text>{structurePDB}</Text>
                                            <ExternalLinkIcon color="greyonpink" />
                                        </HStack>
                                    </ChakraLink>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td width="2" fontWeight="bold" px="0">
                                    Motif residues:
                                </Td>
                                <Td style={{ maxWidth: "17rem", textWrap: "auto" }}>
                                    {surroundingResidues
                                        .map((i) => `${i.res_name} ${i.res_id}/${i.chain_id}`)
                                        .join(", ")}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </VStack>
    );
}

export default MotifDetail;
