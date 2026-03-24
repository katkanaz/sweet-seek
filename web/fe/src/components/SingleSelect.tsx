import { Combobox } from "@base-ui/react/combobox"
import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons"
import { Box, HStack, IconButton, Input, List, ListItem } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { SelectOption, OptionInfo } from "./MultiSelect"



interface SingleSelectProps {
    options: SelectOption[]
    optionInfo: OptionInfo
    query: string 
    setQuery: (query: string) => void
    selected: SelectOption[]
    setSelected: (selected: SelectOption[]) => void
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
    return <div></div>
    const filtered = options?.filter((item) =>
        item.value.toLowerCase().includes(query.toLowerCase())
    )
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement|null>(null);

    return (
        <Combobox.Root
            value={selected}
            items={options}
            // onValueChange={}
        >
            <div className={styles.Label}>
                <label htmlFor={id}>Choose a fruit</label>
                <Combobox.InputGroup className={styles.InputGroup}>
                    <Combobox.Input placeholder="e.g. Apple" id={id} className={styles.Input} />
                    <div className={styles.ActionButtons}>
                        <Combobox.Clear className={styles.Clear} aria-label="Clear selection">
                            <ClearIcon className={styles.ClearIcon} />
                        </Combobox.Clear>
                        <Combobox.Trigger className={styles.Trigger} aria-label="Open popup">
                            <ChevronDownIcon className={styles.TriggerIcon} />
                        </Combobox.Trigger>
                    </div>
                </Combobox.InputGroup>
            </div>

            <Combobox.Portal>
                <Combobox.Positioner className={styles.Positioner} sideOffset={4}>
                    <Combobox.Popup className={styles.Popup}>
                        <Combobox.Empty className={styles.Empty}>No fruits found.</Combobox.Empty>
                        <Combobox.List className={styles.List}>
                            {(item: Fruit) => (
                                <Combobox.Item key={item.value} value={item} className={styles.Item}>
                                    <Combobox.ItemIndicator className={styles.ItemIndicator}>
                                        <CheckIcon className={styles.ItemIndicatorIcon} />
                                    </Combobox.ItemIndicator>
                                    <div className={styles.ItemText}>{item.label}</div>
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
