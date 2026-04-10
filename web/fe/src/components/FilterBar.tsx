import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, HStack, NumberInput, NumberInputField, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Skeleton, Text, VStack, Input } from "@chakra-ui/react"
import MultiSelect, { useMultiSelect } from "./MultiSelect";
import { FilterOptions, getFilterOptions } from "../api/computed_structure";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SingleSelect, { useSingleSelect } from "./SingleSelect";
import { useNavigate } from "@tanstack/react-router";
import { resultsRoute, ResultsSearch } from "../Router";
import PopoverDetail from "./PopoverDetail";


function FilterBar() {
    const navigate = useNavigate({ from: resultsRoute.fullPath });

    const filters = resultsRoute.useSearch()

    const { data, isLoading, isError } = useQuery<FilterOptions, Error>({
        queryKey: ["options"],
        queryFn: getFilterOptions
    });
    const sugarMultiSelect = useMultiSelect(data?.sugars, { isLoading, isError });
    const organismMultiSelect = useMultiSelect(data?.organisms, { isLoading, isError });
    const pdbStructSingleSelect = useSingleSelect(data?.pdb_structures, { isLoading, isError });
    const [title, setTitle] = useState<string|null>(null)
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)

    const min = data?.plddt_range.min;
    const max = data?.plddt_range.max;
    const [ range, setRange ] = useState<[number, number]|undefined>(undefined);

    useEffect(() => {
      if (min !== undefined && max !== undefined && !range) {
        setRange([min, max])
      }
    }, [data, range])

    useEffect(() => {
        if (filters.organism) {
            organismMultiSelect.props.setSelected(organismMultiSelect.props.options.filter(o => filters.organism?.includes(o.id)))
        }
        if (filters.sugar) {
            sugarMultiSelect.props.setSelected(sugarMultiSelect.props.options.filter(o => filters.sugar?.includes(o.id)))
        }
        if (filters.pdbStructure !== undefined) {
            pdbStructSingleSelect.props.setSelected(pdbStructSingleSelect.props.options.find(o => filters.pdbStructure === o.id) ?? null)
        }
        if (filters.plddt) {
            setRange(filters.plddt);
        }
        if (filters.title) {
            setTitle(filters.title)
        }
    }, [filters, data])

    if (!data || !range ) {
      return <Skeleton w="full" h="80px"/>
    }

    const handleFilterClick = () => {
        console.log(pdbStructSingleSelect.props)
        const search: Partial<ResultsSearch> = {
            sugar: sugarMultiSelect.props.selected.length === 0 ? undefined : sugarMultiSelect.props.selected.map(o => o.id),
            organism: organismMultiSelect.props.selected.length === 0 ? undefined : organismMultiSelect.props.selected.map(o => o.id),
            pdbStructure: pdbStructSingleSelect.props.selected?.id ?? undefined,
            plddt: range[0] === min && range[1] === max ? undefined : range,
            title: title ?? undefined,
        }
        navigate({
            search: (prev) => ({...prev, ...search, page: 1})
        });
    }

    return (
        <HStack w="full" alignItems="stretch">
            <VStack alignItems="flex-start">
                <HStack spacing="1" w="full">
                    <Text fontWeight="bold" color="gray.800">
                        Sugar
                    </Text>
                    <PopoverDetail body="Sugar the protein can potentially bind." />
                    {sugarMultiSelect.props.selected.length > 0 &&
                        <Button variant="ghost" size="xs" ml="auto" fontStyle="italic" color="gray.400" onClick={() => sugarMultiSelect.clearSelected()}>
                            clear
                        </Button>
                    }
                </HStack>
                <MultiSelect {...sugarMultiSelect.props} width="6rem" placeholder="e.g. GLC"/>
            </VStack>
            <VStack alignItems="flex-start">
                <HStack spacing="1">
                    <Text fontWeight="bold" color="gray.800">
                        pLDDT
                    </Text>
                    <PopoverDetail body="Global pLDDT value representing the overall confidence of the model." />
                </HStack>
                <VStack spacing="0">
                    <Box px="2" w="full">
                        <RangeSlider
                            aria-label={["min", "max"]}
                            min={min}
                            max={max}
                            value={range}
                            step={0.1}
                            onChange={(val) => setRange(val as [number, number])}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                    </Box>
                    <HStack>
                        <NumberInput
                            width="3rem"
                            size="xs"
                            value={range[0]}
                            min={min}
                            max={range[1]}
                            precision={2}
                            onChange={(_, value) =>
                                setRange([value, range[1]])
                            }
                        >
                          <NumberInputField px="1.5" borderRadius="md" />
                        </NumberInput>
                        <Box w="3" border="solid" borderWidth="0" borderBottomWidth="2px" borderColor="gray.700" />
                        <NumberInput
                            width="3rem"
                            size="xs"
                            value={range[1]}
                            min={range[0]}
                            max={max}
                            onChange={(_, value) =>
                                setRange([range[0], value])
                            }
                        >
                          <NumberInputField px="1.5" borderRadius="md" />
                        </NumberInput>
                    </HStack>
                </VStack>
            </VStack>
            <VStack alignItems="flex-start">
                <HStack spacing="1" w="full">
                    <Text fontWeight="bold" color="gray.800">
                        Organism
                    </Text>
                    <PopoverDetail body="Organism from which the protein originates." />
                    {organismMultiSelect.props.selected.length > 0 &&
                        <Button variant="ghost" size="xs" ml="auto" fontStyle="italic" color="gray.400" onClick={() => organismMultiSelect.clearSelected()}>
                            clear
                        </Button>
                    }
                </HStack>
                <MultiSelect {...organismMultiSelect.props} width="16rem" placeholder="e.g. Madurella mycetomatis"/>
            </VStack>
            <VStack alignItems="flex-start">
                <HStack spacing="1" w="full">
                    <Text fontWeight="bold" color="gray.800">
                        PDB Structure
                    </Text>
                    <PopoverDetail body="PDB ID of the structure the motif originates from." />
                    {pdbStructSingleSelect.props.selected !== null &&
                        <Button variant="ghost" size="xs" ml="auto" fontStyle="italic" color="gray.400" onClick={() => pdbStructSingleSelect.clearSelected()}>
                            clear
                        </Button>
                    }
                </HStack>
                <SingleSelect {...pdbStructSingleSelect.props} width="9rem" placeholder="e.g. 7KHU"/>
            </VStack>
            <VStack alignItems="flex-start">
                <HStack spacing="1" w="full">
                    <Text fontWeight="bold" color="gray.800">
                        Title
                    </Text>
                    <PopoverDetail body="Title of the protein." />
                    {title !== null &&
                        <Button variant="ghost" size="xs" ml="auto" fontStyle="italic" color="gray.400" onClick={() => setTitle(null)}>
                            clear
                        </Button>
                    }
                </HStack>
                <Input
                    value={title ?? ""}
                    onChange={handleTitleChange}
                    size="md"
                    type="text"
                    w="16rem"
                    placeholder="Fucose-specific"
                />
            </VStack>

            <VStack>
                <Box flexGrow={1} w="full"></Box>
                <Button
                    aria-label="Filter results"
                    leftIcon={<SearchIcon aria-label="Search icon" color="gray.800" />}
                    bgColor="#DEDBD2"
                    color="gray.800"
                    minW="24"
                    h="10"
                    onClick={handleFilterClick}
                >
                    Filter
                </Button>

            </VStack>
        </HStack>
    )
}

export default FilterBar;
