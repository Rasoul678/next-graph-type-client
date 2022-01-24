import { Heading, Flex, Button, Link, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";
import withApollo from "../utils/withApollo";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Heading textAlign="center" mb={5} color="teal.200">
        Forgot Password
      </Heading>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: { ...values } });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Flex mt={4} justifyContent="space-between" alignItems="center">
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="teal"
                >
                  forgot password
                </Button>
                <NextLink href="/login">
                  <Link>back to login</Link>
                </NextLink>
              </Flex>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
