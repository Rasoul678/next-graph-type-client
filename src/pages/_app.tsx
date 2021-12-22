import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { createClient, Provider } from "urql";
import DarkModeSwitch from "../components/DarkModeSwitch";
import Container from "../components/Container";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
});

import theme from "../theme";

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Container height="100vh">
            <Component {...pageProps} />
            <DarkModeSwitch />
          </Container>
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
};

export default MyApp;
