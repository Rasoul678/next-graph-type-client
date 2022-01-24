import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../../../components/InputField";
import Wrapper from "../../../components/Wrapper";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import withApollo from "../../../utils/withApollo";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { loading, data } = usePostQuery({
    skip: postId === -1,
    variables: {
      id: postId,
    },
  });

  const [updatePost] = useUpdatePostMutation();

  if (!data) {
    return <Box>No post found :/</Box>;
  }

  if (loading) {
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

          const { errors } = await updatePost({
            variables: {
              id: postId,
              text: values.text,
              title: values.title,
            },
          });

          if (!errors) {
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

export default withApollo({ ssr: true })(EditPost);
