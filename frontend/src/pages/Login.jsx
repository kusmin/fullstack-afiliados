import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import AuthService from "../service/AuthService";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Error',
        description: 'Invalid email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must have at least 6 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true)
    try {
      const user = await AuthService.auth({email, password})
      dispatch(login(user));
      localStorage.setItem("user", JSON.stringify(user.data));
      navigate("/home");
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || "login error. Check your information!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error)
    } finally {
      setLoading(false)
    }
    
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <AuthWrapper>
      <Container
        width="400px"
        p={5}
        boxShadow="xl"
        borderRadius="lg"
        bg="white"
        textAlign="center"
      >
        <VStack spacing="6">
          <form onSubmit={handleSubmit}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit" className="button is-link">
              
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
          <Button mt={2} colorScheme="teal" variant="outline" onClick={handleSignUp}>
            Create Account
          </Button>
        </VStack>
      </Container>
    </AuthWrapper>
  );
};

export default Login;
