import { Flex } from "@chakra-ui/react";

const AuthWrapper = ({ children }) => {
  return (
    <Flex
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, teal.500, teal.300)"
    >
      {children}
    </Flex>
  );
};

export default AuthWrapper;
