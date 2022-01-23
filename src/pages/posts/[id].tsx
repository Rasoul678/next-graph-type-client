import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });

  if (fetching) {
    return <Box>Loading ...</Box>;
  }

  if (!data?.post) {
    return <Box>Could not find post :\</Box>;
  }

  return (
    <Box width='800px'>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading>{data?.post?.title}</Heading>
        <EditDeletePostButtons id={postId} creatorId={data.post.creatorId} />
      </Flex>
      <Text mt={5}>{data?.post?.text}</Text>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
