import MainContainer from "../components/MainContainer";
import {
    Box,
    Flex,
    Heading,
    Link as ChakraLink,
    List,
    ListIcon,
    ListItem,
    Text,
    VStack,
    Image,
    HStack,
    OrderedList,
} from "@chakra-ui/react";
import SweetSeekBullet from "../assets/sweet-seek-bullet";
import resultDetailScreenshot from "../assets/result-detail-docs.png";
import filterbarScreenshot from "../assets/filter-bar-docs.png";
import workflowFlowchart from "../assets/workflow-with-numbers.svg";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { homeRoute, resultsRoute } from "../Router";
import { ImageRef } from "../components/ImageRef";

function Docs() {
    return (
        <MainContainer>
            <Flex>
                <Box
                    mt="4"
                    display={{ base: "none", md: "block" }}
                    w="250px"
                    h="fit-content"
                    p={4}
                    top="14"
                    position="sticky"
                >
                    <VStack align="start" spacing={3}>
                        <ChakraLink href="#web" fontWeight="bold">
                            Web Application
                        </ChakraLink>
                        <ChakraLink href="#web-overview">Pages Overview</ChakraLink>
                        <ChakraLink href="#filters">Filtering Results</ChakraLink>
                        <ChakraLink href="#workflow" fontWeight="bold">
                            Workflow
                        </ChakraLink>
                        <ChakraLink href="#workflow-overview">Overview</ChakraLink>
                        <ChakraLink href="#usage-instructions">Usage Instructions</ChakraLink>
                    </VStack>
                </Box>
                <Box flex="1" p={6} className="docs">
                    <VStack align="start" spacing={8}>
                        <Box id="web">
                            <VStack align="start" spacing={6}>
                                <Heading as="h1" size="xl">
                                    Web Application
                                </Heading>
                                <Text>
                                    This website allows you to explore candidate sugar-binding
                                    proteins. They can be analysed through an interactive interface.
                                    The results were obtained by a bioinformatics workflow. More
                                    information about the workflow process and usage can be found in
                                    section{" "}
                                    <ChakraLink href="#workflow" color="darkaccent">
                                        Workflow
                                    </ChakraLink>
                                    . The following section details how to use the web application
                                    and what features are available.
                                </Text>
                            </VStack>
                        </Box>
                        <Box id="web-overview">
                            <VStack align="start" spacing={6}>
                                <Heading as="h2" size="lg">
                                    Pages Overview
                                </Heading>
                                <Text>The application is divided into the following pages:</Text>
                                <List spacing={2}>
                                    {[
                                        "Home",
                                        "Results",
                                        "Result Detail",
                                        "Statistics",
                                        "Documentation (this page)",
                                    ].map((item) => (
                                        <ListItem key={item}>
                                            <ListIcon as={SweetSeekBullet} color="accent" />
                                            {item}
                                        </ListItem>
                                    ))}
                                </List>
                                <Text>
                                    The top bar of each page includes information about when the
                                    results were last updated as well as navigation links, which you
                                    can use to move through the application.
                                </Text>
                                <Heading as="h3" size="md">
                                    Home Page
                                </Heading>
                                <Box>
                                    The{" "}
                                    <ChakraLink
                                        as={TanstackRouterLink}
                                        to={homeRoute.to}
                                        target="_blank"
                                        color="darkaccent"
                                    >
                                        <HStack alignItems="center" gap="1" display="inline-flex">
                                            <Text>home page</Text>
                                            <ExternalLinkIcon h="3.5" />
                                        </HStack>
                                    </ChakraLink>{" "}
                                    provides a brief introduction to the purpose of the website and
                                    explains what kind of data is presented on this website. It also
                                    includes a glossary of terms specific for this project.
                                </Box>
                                <Text>
                                    You will find three main navigation cards that take you directly
                                    to:
                                </Text>
                                <List spacing={2}>
                                    {["Results page", "Statistics page", "Documentation page"].map(
                                        (item) => (
                                            <ListItem key={item}>
                                                <ListIcon as={SweetSeekBullet} color="accent" />
                                                {item}
                                            </ListItem>
                                        ),
                                    )}
                                </List>

                                <Heading as="h3" size="md">
                                    Results Page
                                </Heading>
                                <Box>
                                    The{" "}
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
                                    </ChakraLink>{" "}
                                    displays a list of candidate sugar-binding proteins. By default,
                                    results are sorted by the best (lowest) RMSD across all of their
                                    motif matches. When filtering by sugar, results are re-sorted
                                    based on the best RMSD of the selected sugar(s). Filtering is
                                    described in more detail in a separate section:{" "}
                                    <ChakraLink href="#filters" color="darkaccent">
                                        Filtering Results
                                    </ChakraLink>
                                    .
                                </Box>
                                <Text>
                                    <strong>RMSD (Root Mean Square Deviation)</strong> indicates how
                                    closely a detected motif match matches the original motif. Lower
                                    values represent better matches. It will always be lower than 3 Å, since that is used as the cut off value during the structure-based search step of the workflow (see{" "}
                                    <ChakraLink href="#workflow-steps" color="darkaccent">
                                        Workflow Steps
                                    </ChakraLink>
                                    ). 
                                </Text>
                                <Text>Each result in the list shows:</Text>
                                <List spacing={2}>
                                    {[
                                        "Structure title",
                                        "Organism",
                                        "Link to the AlphaFold database entry",
                                        "Link to the UniProt protein entry",
                                        "Global pLDDT score (computed structure model confidence)",
                                        "Best motif match described as the sugar and the corresponding RMSD value",
                                    ].map((item) => (
                                        <ListItem key={item}>
                                            <ListIcon as={SweetSeekBullet} color="accent" />
                                            {item}
                                        </ListItem>
                                    ))}
                                </List>
                                <Text>
                                    Each result includes a preview image of the computed protein
                                    structure, colored by confidence (global pLDDT). Clicking the
                                    image or title opens the result detail page.
                                </Text>
                                <Heading as="h3" size="md">
                                    Result Detail Page
                                </Heading>
                                <Text>
                                    The result detail page provides an in-depth view of a selected
                                    protein and its motif matches. Below is a screenshot showing an
                                    example result detail.
                                </Text>

                                <Box border="solid" borderWidth="1px" borderColor="primary" p="2">
                                    <Image src={resultDetailScreenshot} />
                                </Box>

                                <Heading as="h4" size="sm">
                                    Left Column
                                </Heading>
                                <Text>
                                    The left column shows basic information about the result and a
                                    list of motif match cards. The basic information in the top part
                                    of the column <ImageRef>(1)</ImageRef> includes:
                                </Text>
                                <List spacing={2}>
                                    {[
                                        "Organism the protein originates from",
                                        "Links to AlphaFold and UniProt entries",
                                        "Global pLDDT score",
                                    ].map((item) => (
                                        <ListItem key={item}>
                                            <ListIcon as={SweetSeekBullet} color="accent" />
                                            {item}
                                        </ListItem>
                                    ))}
                                </List>
                                <Text>
                                    Each motif match card <ImageRef>(2)</ImageRef> contains the
                                    following information:
                                </Text>
                                <List spacing={2}>
                                    {[
                                        "Possible binding sugar",
                                        "RMSD value (match quality)",
                                        "Residues forming the motif match in the computed structure",
                                        "PDB structure from which the motif originates",
                                        "Residues forming the original motif",
                                    ].map((item) => (
                                        <ListItem key={item}>
                                            <ListIcon as={SweetSeekBullet} color="accent" />
                                            {item}
                                        </ListItem>
                                    ))}
                                </List>
                                <Heading as="h4" size="sm">
                                    Right Column (3D Viewer)
                                </Heading>
                                <Box>
                                    An interactive 3D viewer (
                                    <ChakraLink
                                        href="https://molstar.org/"
                                        target="_blank"
                                        color="darkaccent"
                                    >
                                        <HStack alignItems="center" gap="0.5" display="inline-flex">
                                            <Text>Mol*</Text>
                                            <ExternalLinkIcon h="3.5" />
                                        </HStack>
                                    </ChakraLink>
                                    ) allows you to explore the computed protein structure{" "}
                                    <ImageRef>(3)</ImageRef>. By default, only the computed
                                    structure colored by confidence (global pLDDT) is shown.
                                    Clicking the Align button <ImageRef>(4)</ImageRef> on a given
                                    motif match card will superimpose the original PDB structure
                                    onto the computed structure. Clicking the Clear button{" "}
                                    <ImageRef>(5)</ImageRef> will switch back to the default view.
                                </Box>
                                <Heading as="h3" size="md">
                                    Statistics Page
                                </Heading>
                                <Text>
                                    The statistics page provides an overview of the results and the
                                    data used in the workflow (learn more in section{" "}
                                    <ChakraLink href="#workflow" color="darkaccent">
                                        Workflow
                                    </ChakraLink>
                                    ). The page contains tables, graphs and descriptions of the
                                    shown data.
                                </Text>
                            </VStack>
                        </Box>
                        <Box id="filters">
                            <VStack align="start" spacing={6}>
                                <Heading as="h2" size="lg">
                                    Filtering Results
                                </Heading>
                                <Box border="solid" borderWidth="1px" borderColor="primary" p="2">
                                    <Image src={filterbarScreenshot} />
                                </Box>
                                <Text>
                                    You can refine the displayed results using the following
                                    filters:
                                </Text>
                                <List spacing={2}>
                                    {[
                                        <>
                                            Sugar the protein may bind <ImageRef>(1)</ImageRef>
                                        </>,
                                        <>
                                            Model confidence (global pLDDT score){" "}
                                            <ImageRef>(2)</ImageRef>
                                        </>,
                                        <>
                                            Organism the protein originates from{" "}
                                            <ImageRef>(3)</ImageRef>
                                        </>,
                                        <>
                                            Source PDB structure of the queried motif{" "}
                                            <ImageRef>(4)</ImageRef>
                                        </>,
                                        <>
                                            Title of the computed structure <ImageRef>(5)</ImageRef>
                                        </>,
                                    ].map((item, i) => (
                                        <ListItem key={i}>
                                            <ListIcon as={SweetSeekBullet} color="accent" />
                                            {item}
                                        </ListItem>
                                    ))}
                                </List>
                                <Text>
                                    Filter options are automatically generated from the available
                                    results. Multiple selections are allowed for all filters except
                                    the PDB structure filter. The title filter performs basic text
                                    search. You can reset each filter by clicking its clear button.
                                    Apply your selections using the <strong>Filter</strong> button{" "}
                                    <ImageRef>(6)</ImageRef>. When 2 or more filters are active only
                                    results matching all active filters are shown. When a filter has
                                    multiple values selected, any results matching at least one
                                    value is shown.
                                </Text>
                            </VStack>
                        </Box>
                        <Box id="workflow">
                            <Heading as="h1" size="xl">
                                Workflow
                            </Heading>
                        </Box>
                        <Box id="workflow-overview">
                            <VStack align="start" spacing={6}>
                                <Heading as="h2" size="lg">
                                    Overview
                                </Heading>
                                <Box>
                                    An automated bioinformatics workflow was developed to identify
                                    candidate sugar-binding proteins using structural data. The
                                    workflow processes experimentally determined structures
                                    containing sugars, extracts representative binding surroundings
                                    (motifs), and uses them to search for motif matches in a subset
                                    of about one million of <strong>AlphaFold 2</strong> predicted
                                    protein structures available in the{" "}
                                    <ChakraLink
                                        href="https://www.rcsb.org/"
                                        target="_blank"
                                        color="darkaccent"
                                    >
                                        <HStack alignItems="center" gap="0.5" display="inline-flex">
                                            <Text>Protein Data Bank (PDB)</Text>
                                            <ExternalLinkIcon h="3.5" />
                                        </HStack>
                                    </ChakraLink>
                                    .
                                </Box>
                                <Heading as="h3" size="md" id="workflow-steps">
                                    Workflow Steps
                                </Heading>
                                <Text>
                                    The workflow consists of two main stages:{" "}
                                    <strong>Data Pre-processing</strong> and{" "}
                                    <strong>Surrounding Analysis</strong>. Bellow you can see a
                                    flowchart of the workflow. Each step is numbered and described
                                    in the list bellow.
                                </Text>
                                <Image src={workflowFlowchart} pl="5" />
                                <OrderedList spacing={2} pl="5">
                                    {[
                                        "Download structures containing sugars from a local PDB mirror.",
                                        "Identify sugars that are non-covalently bound (ligads), excluding glycosylations and close contacts.",
                                        "Separate alternative sugar conformations (A/B). Structures with unsupported conformations (e.g., C) are excluded.",
                                        "Apply quality filtering based on structure resolution (≤ 3 Å), RSCC values (≥ 0.8), and ligand RMSD validation (≤ 2 Å).",
                                        "Extract the surroundings of a selected sugar by identifying residues within 5 Å.",
                                        "Process and filter the extracted surroundings to ensure they contain at least 5 residues and remove other sugars (e.g., from larger glycans).",
                                        "Cluster similar surroundings based on structural similarity (RMSD) and select representative motifs.",
                                        "Perform a structure-based search using these motifs against a subset of about one million AlphaFold 2-predicted protein structures.",
                                    ].map((item, index) => (
                                        <ListItem key={index}>{item}</ListItem>
                                    ))}
                                </OrderedList>
                                <Text>
                                    The final output of this workflow is a set of predicted protein
                                    structures that contain motifs similar to known sugar-binding
                                    surroundings. These results are then presented and explored
                                    through the web interface.
                                </Text>
                            </VStack>
                        </Box>
                        <Box id="usage-instructions">
                            <VStack align="start" spacing={6}>
                                <Heading as="h2" size="lg">
                                    Usage Instructions
                                </Heading>
                                <Box>
                                    The workflow is primarily written in python. It can be installed
                                    and run locally or one can use predefined Docker image, which
                                    conveniently sets up all prerequisites. However, both
                                    installation methods still require access to a PDB mirror. The
                                    mirror can either be on the same machine or you can define a
                                    remote host which holds the mirror. For more detailed
                                    instructions see the project's{" "}
                                    <ChakraLink
                                        href="https://github.com/katkanaz/sweet-seek"
                                        target="_blank"
                                        color="darkaccent"
                                    >
                                        <HStack alignItems="center" gap="0.5" display="inline-flex">
                                            <Text>GitHub page</Text>
                                            <ExternalLinkIcon h="3.5" />
                                        </HStack>
                                    </ChakraLink>
                                    .
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </MainContainer>
    );
}

export default Docs;
