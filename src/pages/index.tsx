import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Link,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import UpvoteSection from "../components/UpvoteSection";
import { DeleteIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [_, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <Box>No Posts</Box>;
  }

  return (
    <Box minHeight="100vh" width="100%">
      <Flex
        width="60%"
        mx="auto"
        justifyContent="space-between"
        alignItems="center"
        my={5}
      >
        <Heading>Posts list</Heading>
        <NextLink href="/create-post">
          <Button bgColor="teal">New Post</Button>
        </NextLink>
      </Flex>
      {!fetching && data ? (
        <Stack spacing={8} mx="auto" width="60%">
          {data?.posts.posts.map((post) =>
            !post ? null : (
              <Flex
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius={10}
                key={post.id}
              >
                <UpvoteSection post={post} />
                <Box flex={1}>
                  <Link>
                    <NextLink href="/posts/[id]" as={`/posts/${post.id}`}>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </NextLink>
                  </Link>
                  <Flex gap={1}>
                    posted by:{" "}
                    <Text color="coral"> {post.creator.username}</Text>
                  </Flex>
                  <Flex alignItems="flex-end">
                    <Text flex={1} mt={4}>
                      {post.textSnippet}
                    </Text>
                    <IconButton
                      aria-label="Delete Post"
                      size="sm"
                      colorScheme="red"
                      icon={<DeleteIcon boxSize={4} />}
                      onClick={() => deletePost({ id: post.id })}
                    />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      ) : (
        <Box>Loading ...</Box>
      )}
      {data && data.posts.hasMore && (
        <Box textAlign="center" my={5}>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
            size="sm"
          >
            show more
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
