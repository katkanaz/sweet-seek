import { QuestionOutlineIcon } from "@chakra-ui/icons"
import { IconButton, Popover, PopoverArrow, Link as ChakraLink, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverTrigger, Text, PopoverBody } from "@chakra-ui/react"
import { Link as TanstackRouterLink } from "@tanstack/react-router"
import { docsRoute } from "../Router";


interface PopoverDetailProps {
    body: string
}

function PopoverDetail({ body }: PopoverDetailProps) {
    return (
        <Popover
            placement="bottom"
            closeOnBlur={true}
        >
            <PopoverTrigger>
                <IconButton aria-label="Tooltip" icon={<QuestionOutlineIcon w="4" h="4" />} variant="ghost" size="xs" />
            </PopoverTrigger>
            <PopoverContent color="black" bg="#F7E1D7" borderColor="#F7E1D7" p={2}>
                <PopoverArrow bg="#F7E1D7" />
                <PopoverCloseButton />
                <PopoverBody>
                    {body}
                </PopoverBody>
                <PopoverFooter
                    border="0"
                >
                    <Text fontSize="sm">
                        For more information see the <ChakraLink as={TanstackRouterLink} to={docsRoute.to} target="_blank" color="green.800">documentation</ChakraLink>
                    </Text>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverDetail;
