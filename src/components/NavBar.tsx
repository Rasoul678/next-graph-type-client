import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    //! We can cancel ssr query by making this true.
    pause: isServer(), //! See if we are in browser or in server side.
  });

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let child;

  if (fetching) {
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
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            router.reload();
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

export default NavBar;
