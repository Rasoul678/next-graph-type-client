import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import withApollo from "../utils/withApollo";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    //! We can cancel ssr query by making this true.
    skip: isServer(), //! See if we are in browser or in server side.
  });

  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  let child;

  if (loading) {
    //! Data is loading
    child = null;
  } else if (!data?.me) {
    //! User not logged in
    child = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    //! User is logged in
    child = (
      <Flex>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutLoading}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex width="100%" p="4">
      <Link>
        <NextLink href="/">
          <Heading>NextGraphQl</Heading>
        </NextLink>
      </Link>
      <Box ml="auto">{child}</Box>
    </Flex>
  );
};

export default withApollo({ ssr: true })(NavBar);
