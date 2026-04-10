import { Text, HStack } from "@chakra-ui/react";
import MainContainer from "../components/MainContainer";
import { docsRoute, resultsRoute, statsRoute } from "../Router";
import HomeCard from "../components/HomeCard";


function Home() {
    return (
        <MainContainer width="60%">
            <Text mt="12" fontWeight="bold" fontFamily="fantasy" fontSize="xl">
                Welcome to SweetSeek,
            </Text>
            <Text mt="6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et fringilla mauris, at vestibulum est. Pellentesque posuere feugiat turpis, eu cursus dolor iaculis ut. In varius interdum augue, sed convallis ligula fringilla id. Phasellus et sodales sem. Etiam neque turpis, dignissim non aliquet id, euismod eu erat.
                In imperdiet quam sed mollis pulvinar. Proin porttitor et mauris in interdum. Proin porttitor nisl ac dignissim hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat ante ac massa sagittis pretium. Nunc feugiat lobortis pharetra. Donec quis felis eget orci egestas elementum. Praesent mollis scelerisque maximus. Praesent feugiat tincidunt congue. Aenean consectetur eros id dui scelerisque vulputate.
            </Text>
            <Text mt="6" mb="4">
                Donec tempus odio ipsum, a lobortis ipsum consectetur sit amet. Praesent finibus arcu sed felis faucibus semper. Aliquam sem lectus, commodo quis elementum ut, efficitur non elit. Phasellus accumsan eros in dolor posuere auctor. Nullam vel est tempus, porttitor ligula sed, sagittis urna.
            </Text>
            <HStack mt="10" spacing="3">
                <HomeCard color="#F4CDD3" cardText="Explore the reuslts" route={resultsRoute.to} />
                <HomeCard color="#F7E1D7" cardText="See result statistics" route={statsRoute.to} />
                <HomeCard color="#DEDBD2" cardText="Learn more" route={docsRoute.to} />
            </HStack>
        </MainContainer>
    )
}

export default Home;
