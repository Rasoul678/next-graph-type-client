import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

type LoadingState = "upvote-loading" | "downvote-loading" | "not-loading";

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
          });
          setLoadingState("not-loading");
        }}
      />
    </Flex>
  );
};

export default UpvoteSection;
