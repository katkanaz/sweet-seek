import { Combobox } from "@base-ui/react/combobox"
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box, HStack, IconButton, Input, List, ListItem } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { SelectOption, OptionInfo } from "./MultiSelect"


interface SingleSelectProps {
    options: SelectOption[]
    optionInfo: OptionInfo
    query: string 
    setQuery: (query: string) => void
    selected: SelectOption | null
    setSelected: (selected: SelectOption | null) => void
    width?: string
    placeholder: string
}

export function useSingleSelect(options: SelectOption[] | undefined, optionInfo: OptionInfo) {
    const [ query, setQuery ] = useState("")
    const [ selected, setSelected ] = useState<SelectOption|null>(null)
    const clearSelected = () => {
        setSelected(null)
    }
    const singleSelectReturn = { props: { query, setQuery, selected, setSelected, options: options ?? [], optionInfo}, clearSelected }
    return singleSelectReturn
}

function SingleSelect({ options, optionInfo, query, setQuery, selected, setSelected, width, placeholder }: SingleSelectProps) {
//     const filtered = options?.filter((item) =>
//         item.value.toLowerCase().includes(query.toLowerCase())
//     )
    const containerRef = useRef<HTMLDivElement | null>(null);
//     const inputRef = useRef<HTMLInputElement|null>(null);

    return (
        <Combobox.Root
            value={selected}
            items={options}
            onValueChange={setSelected}
        >
            <Box>
                <Combobox.InputGroup  ref={containerRef}>
                    <Combobox.Input placeholder={placeholder}
                        render={(props) => (
                            <Input
                                minW="3rem"
                                flex="1"
                                width={width ?? "5rem"}
                                {...props}
                            />
                        )}
                    />
                    <Box display="flex" position="absolute" bottom="0" right="0.5rem" height="2.5rem" border="none" alignItems="center" justifyContent="center" >
                        <Combobox.Trigger aria-label="Open popup"
                            render={(props) => (
                                <IconButton {...props as any} icon={<ChevronDownIcon w="1rem" h="1rem" />} />
                            )}
                        >
                            
                        </Combobox.Trigger>
                    </Box>
                </Combobox.InputGroup>
            </Box>

            <Combobox.Portal>
                <Combobox.Positioner anchor={containerRef}>
                    <Combobox.Popup
                        render={(props) => (
                            <Box
                                {...props}
                                mt={2}
                                borderWidth="1px"
                                borderRadius="md"
                                maxH="200px"
                                width="var(--anchor-width)"
                                overflowY="auto"
                                bg="white"
                            />

                        )}
                    >
                        <Combobox.Empty>
                            <Box fontSize="0.925rem" lineHeight="1rem" color="gray.600" p="1rem">No options found.</Box>
                        </Combobox.Empty>
                        <Combobox.List
                            render={(props) => (
                                <List
                                    {...props}
                                />
                            )}
                        >
                            {(item: SelectOption) => (
                                <Combobox.Item key={item.value} value={item}
                                    render={(props, state) => (
                                        <ListItem
                                            {...props}
                                            px={3}
                                            py={2}
                                            cursor="pointer"
                                            bg={
                                                state.highlighted
                                                    ? "gray.100"
                                                    : "transparent"
                                            }
                                        >
                                            <HStack>
                                                <Combobox.ItemIndicator style={{gridColumnStart: 1}}>
                                                    <CheckIcon display="block" w="0.75rem" h="0.75rem"/>
                                                </Combobox.ItemIndicator>
                                                <Box>
                                                    {item.value}
                                                </Box>
                                            </HStack>
                                        </ListItem>
                                    )}
                                >
                                </Combobox.Item>
                            )}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    )
}

export default SingleSelect
