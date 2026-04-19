import { ExternalLinkIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Popover,
    PopoverArrow,
    Link as ChakraLink,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    PopoverBody,
    Text,
} from "@chakra-ui/react";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { docsRoute } from "../Router";

interface PopoverDetailProps {
    body: string;
    children?: React.ReactNode;
}

function PopoverDetail({ body, children }: PopoverDetailProps) {
    return (
        <Popover placement="bottom" closeOnBlur={true} size="xl">
            <PopoverTrigger>
                {children ? (
                    children
                ) : (
                    <IconButton
                        aria-label="Tooltip"
                        icon={<QuestionOutlineIcon w="4" h="4" color="text" />}
                        variant="ghost"
                        size="xs"
                    />
                )}
            </PopoverTrigger>
            <PopoverContent color="text" bg="secondary" borderColor="secondary" p={1}>
                <PopoverArrow bg="secondary" />
                <PopoverCloseButton />
                <PopoverBody>{body}</PopoverBody>
                <PopoverFooter border="0">
                    <Text fontSize="sm">
                        See the{" "}
                        <ChakraLink
                            as={TanstackRouterLink}
                            to={docsRoute.to}
                            target="_blank"
                            color="darkaccent"
                        >
                            documentation <ExternalLinkIcon />
                        </ChakraLink>{" "}
                        for more information.
                    </Text>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export default PopoverDetail;
