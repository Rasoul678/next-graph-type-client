import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data } = useMeQuery();

  if (data?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <IconButton
        aria-label="Delete Post"
        size="sm"
        icon={<DeleteIcon color="coral" boxSize={4} />}
        onClick={() =>
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({
                id: "Post:" + id,
              });
            },
          })
        }
      />
      <NextLink href="/posts/edit/[id]" as={`/posts/edit/${id}`}>
        <IconButton
          aria-label="Edit Post"
          size="sm"
          ml={3}
          icon={<EditIcon boxSize={4} />}
        />
      </NextLink>
    </Box>
  );
};

export default EditDeletePostButtons;
