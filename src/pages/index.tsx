import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import UpvoteSection from "../components/UpvoteSection";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
    // notifyOnNetworkStatusChange: true, //! This will trigger the loading state.
  });

  if (!loading && !data) {
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
      {!loading && data ? (
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
                    <EditDeletePostButtons
                      id={post.id}
                      creatorId={post.creatorId}
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
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                //! Method _1_ to fetch more data
                // updateQuery: (previousValue, { fetchMoreResult }) => {
                //   if (!fetchMoreResult) {
                //     return previousValue;
                //   }

                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: fetchMoreResult.posts.hasMore,
                //       posts: [
                //         ...previousValue.posts.posts,
                //         ...fetchMoreResult.posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
            }}
            isLoading={loading}
            size="sm"
          >
            show more
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
