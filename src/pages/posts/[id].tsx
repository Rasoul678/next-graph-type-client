import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
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
    return <Box>Post Not Found!!!</Box>;
  }

  return (
    <Box>
      <Heading>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
