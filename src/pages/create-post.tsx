import { Heading, Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useIsAuth } from "../hooks/useIsAuth";

interface CreatePostProps {}

const createPost: React.FC<CreatePostProps> = ({}) => {
  const [_, createPost] = useCreatePostMutation();
  const router = useRouter();
  const { fetching } = useIsAuth();

  if (fetching) {
    return <Box>Loading...</Box>;
  }

  return (
    <Wrapper variant="small">
      <Heading textAlign="center" mb={5} color="teal.200">
        Create Post
      </Heading>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });

          if (!error) {
            router.push("/");
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(createPost);
