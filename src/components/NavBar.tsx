import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

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
        <Button variant="link">Logout</Button>
      </Flex>
    );
  }

  return (
    <Flex width="100%" p="4">
      <Box ml="auto">{child}</Box>
    </Flex>
  );
};

export default NavBar;
