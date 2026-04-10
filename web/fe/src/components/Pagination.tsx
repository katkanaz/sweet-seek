import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, HStack, Select, Text } from "@chakra-ui/react";


interface PaginationProps {
    totalCount: number
    page: number
    count: number
    handleNext: () => void
    handlePrev: () => void
    handleCountChange: (count: number) => void
    nextEnabled?: boolean
    prevEnabled?: boolean
};

function Pagination({ totalCount, page, count, handleNext, handlePrev, handleCountChange, nextEnabled = true, prevEnabled = true }: PaginationProps) {
    const startIdx = (page - 1) * count
    const endIdx = Math.min(startIdx + count, totalCount)
    return (
        <HStack w="full" justifyContent="flex-end" spacing="6">
            <HStack>
                <Text fontSize="sm">Results per page</Text>
                <Select
                    w="fit-content"
                    size="xs"
                    onChange={(e) => handleCountChange(parseInt(e.currentTarget.value))}
                    value={count}
                >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                </Select>
            </HStack>
            <HStack>
                <Text>
                    {startIdx + 1}-{endIdx} of {totalCount}
                </Text>
            </HStack>
            <HStack>
                <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<ChevronLeftIcon />}
                    onClick={() => handlePrev()}
                    disabled={!prevEnabled}
                >Previous</Button>
                <Button
                    size="xs"
                    variant="ghost"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => handleNext()}
                    disabled={!nextEnabled}
                >Next</Button>
            </HStack>
        </HStack> 
    )
}

export default Pagination;
