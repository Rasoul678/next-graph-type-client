import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

type LoadingState = "upvote-loading" | "downvote-loading" | "not-loading";

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    votes: number;
    voteStatus: number | null;
  }>({
    id: `Post:${postId}`,
    fragment: gql`
      fragment _ on Post {
        id
        votes
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }

    const newVotes =
      (data.votes as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment({
      id: `Post:${postId}`,
      fragment: gql`
        fragment __ on Post {
          votes
          voteStatus
        }
      `,
      data: {
        votes: newVotes,
        voteStatus: value,
      },
    });
  }
};

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("not-loading");
  const [vote] = useVoteMutation();

  return (
    <Flex
      mr={5}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      gap={2}
    >
      <IconButton
        aria-label="up-vote"
        colorScheme={post.voteStatus === 1 ? "teal" : undefined}
        size="sm"
        icon={<ChevronUpIcon boxSize={6} />}
        isLoading={loadingState === "upvote-loading"}
        onClick={async () => {
          setLoadingState("upvote-loading");
          await vote({
            variables: {
              postId: post.id,
              vote: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
      />

      {post.votes}
      <IconButton
        aria-label="down-vote"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        size="sm"
        icon={<ChevronDownIcon boxSize={6} />}
        isLoading={loadingState === "downvote-loading"}
        onClick={async () => {
          setLoadingState("downvote-loading");
          await vote({
            variables: {
              postId: post.id,
              vote: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
      />
    </Flex>
  );
};

export default UpvoteSection;
