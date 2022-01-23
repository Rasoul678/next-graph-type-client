import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import InputField from "../../../components/InputField";
import Wrapper from "../../../components/Wrapper";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });

  const [_, updatePost] = useUpdatePostMutation();

  if (!data) {
    return <Box>No post found :/</Box>;
  }

  if (fetching) {
    return <Box>Loading ...</Box>;
  }

  return (
    <Wrapper variant="small">
      <Heading textAlign="center" mb={5} color="teal.200">
        Edit Post
      </Heading>
      <Formik
        initialValues={{ title: data.post?.title, text: data.post?.text }}
        onSubmit={async (values) => {
          if (!values.text || !values.title) {
            return;
          }
          
          const { error } = await updatePost({
            id: postId,
            text: values.text,
            title: values.title,
          });

          if (!error) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text"
                label="Text"
              />
            </Box>
            <Button
              mt={5}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
