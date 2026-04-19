import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Center, HStack, Link as ChakraLink, Spinner, Table, TableContainer, Tbody, Td, Text, Tr, VStack, Button } from "@chakra-ui/react"
import MainContainer from "../components/MainContainer"
import { getCompStruct, ComputedStructure, Motif } from "../api/computed_structure"
import { resultDetailRoute } from "../Router";
import MotifDetail from "../components/MotifDetail";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MolStarWrapper, { decompose4x4Matrix } from "../components/MolStarWrapper";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { loadMVS, MVSData } from "molstar/lib/extensions/mvs";


function mvsComputed(pdbId: string, transform?: number[]) {
    const mvsBuilder = MVSData.createBuilder()
    const struct = mvsBuilder
        .download({url: `https://models.rcsb.org/${pdbId}.bcif`})
        .parse({format: "bcif"})
        .modelStructure()

    if (transform !== undefined) {
        const {rotation, translation} = decompose4x4Matrix(transform)
        struct
            .transform({
                rotation: rotation,
                translation: translation,
            })
    }

    struct
        .component()
        .representation()
        .colorFromSource(
            {
                schema: "all_atomic",
                category_name: "atom_site",
                field_name: "B_iso_or_equiv",
                palette: {
                    kind: "discrete",
                    colors: [["#FF7D45", 0], ["#FFDB13", 50], ["#65CBF3", 70], ["#0053D6", 90]],
                    mode: "absolute",
                }
            }
        )

    return mvsBuilder
}

function ResultDetail() {
    const { afId } = resultDetailRoute.useParams();

    const { data: compStruct, isLoading, isError } = useQuery<ComputedStructure, Error>({
        queryKey: ["comp-struct"],
        queryFn: () => getCompStruct(afId)
    });

    const [ molStar, setMolStar ] = useState<PluginUIContext|undefined>(undefined);
    const [ molStarReady, setMolStarReady] = useState(false);
    const [ alignActive, setAlignActive] = useState<number|null>(null);

    const showComputedStruct = async () => {
        if (!compStruct || !molStar || !window.molstar) return

        const mvsData = mvsComputed(compStruct.pdb_id).getState()

        await window.molstar?.initialized;
        await loadMVS(window.molstar, mvsData, {sourceUrl: undefined, sanityChecks: true});
    }

    useEffect(() => {
        if (!compStruct || !molStar || !window.molstar) return
        window.molstar.clear().then(() => {
            showComputedStruct();

            setMolStarReady(true);
        })
    }, [compStruct, molStar]);

    const handleAlignClick = (motif: Motif, num: number) => {
        if (!compStruct || !molStar || !molStarReady || !window.molstar) return

        window.molstar.clear().then(async () => {
            const mvsBuilder = mvsComputed(compStruct.pdb_id, motif.transformation);

            const structure = mvsBuilder
            .download({url: `https://files.rcsb.org/download/${motif.original_struct}.cif`})
            .parse({format: "mmcif"})
            .modelStructure()

            structure
                .component({selector: "polymer"})
                .representation({type: "cartoon"})
                .color({color: "red"})


            structure.component({selector: "branched"}).representation({type: "ball_and_stick"}).color({color: "green"})
            structure.component({selector: "branched"}).representation({type: "carbohydrate"}).color({
                custom: {"molstar_use_default_coloring": true}
            })

            const mvsData = mvsBuilder.getState();


            await window.molstar?.initialized;
            await loadMVS(window.molstar!, mvsData, {sourceUrl: undefined, sanityChecks: true});
            setAlignActive(num);
        })
    }

    const clearAlign = async () => {
        await showComputedStruct();
        setAlignActive(null);
    }

    if (isLoading) {
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

    if (compStruct === undefined) {
        return (
            <MainContainer>
                <Box >Unknow AlphaFold ID</Box>
            </MainContainer>
        )
    }

    return (
        <MainContainer>
            <VStack width="100%" alignItems="flex-start" mt="3">
                <Box fontWeight="bold" fontSize="3xl">{compStruct.title}</Box>
                <HStack width="100%" alignItems="flex-start" spacing="10">
                    <Box>
                        <TableContainer>
                            <Table variant="striped" colorScheme="whiteAlpha" size="sm">
                                <Tbody>
                                    <Tr>
                                        <Td width="2" fontWeight="bold" px="0">AlphaFold DB:</Td>
                                        <Td>
                                            <ChakraLink
                                                href={`https://alphafold.ebi.ac.uk/entry/${compStruct.afdb_id.split("-")[1]}`}
                                                target="_blank"
                                                w="fit-content"
                                                display="inline-block"
                                            >
                                                <HStack alignItems="center" gap="1">
                                                    <Text>
                                                        {compStruct.afdb_id}
                                                    </Text>
                                                    <ExternalLinkIcon color="greyonpink" />
                                                </HStack>
                                            </ChakraLink>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td width="2" fontWeight="bold" px="0">UniProtKB:</Td>
                                        <Td>
                                            <ChakraLink
                                                href={`https://www.uniprot.org/uniprotkb/${compStruct.afdb_id.split("-")[1]}`}
                                                target="_blank"
                                                w="fit-content"
                                                display="inline-block"
                                            >
                                                <HStack alignItems="center" gap="1">
                                                    <Text>
                                                        {`${compStruct.afdb_id.split("-")[1]}`}
                                                    </Text>
                                                    <ExternalLinkIcon color="greyonpink" />
                                                </HStack>
                                            </ChakraLink>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td width="2" fontWeight="bold" px="0">pLDDT (global)</Td>
                                        <Td>
                                            {compStruct.plddt}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td width="2" fontWeight="bold" px="0">Organism:</Td>
                                        <Td>
                                            <Text>
                                                {compStruct.organism}
                                            </Text>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td width="2" fontWeight="bold" px="0">Total number of motif matches:</Td>
                                        <Td>
                                            {compStruct.accepted_motifs.length + (compStruct.rejected_motifs?.length ?? 0)}
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <VStack mt="3">
                            {compStruct.accepted_motifs.map((m, i) => (
                                <MotifDetail
                                    key={i}
                                    num={i+1}
                                    sugar={m.sugar}
                                    rmsd={m.score}
                                    residueIds={m.residue_ids}
                                    structurePDB={m.original_struct}
                                    surroundingResidues={m.surrounding_residues}
                                    enableAlign={molStarReady}
                                    handleAlignClick={() => handleAlignClick(m, i+1)}
                                />
                            ))}
                        </VStack>
                    </Box>
                    <VStack flexGrow="1">
                        <HStack justifyContent="flex-end" w="full">
                            <Box textColor="greyonpink" fontSize="sm">
                                AFDB version: {compStruct.af_revision}
                            </Box>
                        </HStack>
                        <Box position="relative" width="100%" zIndex="10">
                            <MolStarWrapper setMolStar={setMolStar} />
                        </Box>
                        {alignActive &&
                            <HStack w="full" p="2" bg="primary" spacing="4" justifyContent="space-between">
                                <Box pl="1">Showing aligned Motif Match {alignActive}</Box>
                                <Button onClick={() => clearAlign()} variant="outline" borderColor="text">Clear</Button>
                            </HStack>
                        }
                    </VStack>
                </HStack>
            </VStack>
        </MainContainer>
    )
}

export default ResultDetail;
