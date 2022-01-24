import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import Container from "../components/Container";
import DarkModeSwitch from "../components/DarkModeSwitch";
import theme from "../theme";

const MyApp = ({ Component, pageProps }: any) => {
  return (
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
          }}
        >
          <Container height="auto" minHeight="100vh">
            <Component {...pageProps} />
            <DarkModeSwitch />
          </Container>
        </ColorModeProvider>
      </ChakraProvider>
  );
};

export default MyApp;
