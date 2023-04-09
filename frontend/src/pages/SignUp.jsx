import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import AuthService from "../service/AuthService";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

   
    const create = {
      email,
      name,
      username,
      password
    };

    try {
      setLoading(true)
      await AuthService.register(create)
      navigate("/login");
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || "Create acount error. Check your information!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error)
    } finally {
      setLoading(false)
    }

    
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !name || !username) {
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

     if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    return true;
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <AuthWrapper>
      <Box width="50%" mx="auto" my="10">
        <VStack
          spacing="6"
          background="white"
          p="6"
          borderRadius="md"
          boxShadow="md"
        >
          <form onSubmit={handleSubmit}>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                borderColor="gray.400"
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                borderColor="gray.400"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderColor="gray.400"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor="gray.400"
              />
            </FormControl>
            <FormControl id="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                borderColor="gray.400"
              />
            </FormControl>

            <HStack justifyContent="center" mt={4}>
              <Button
                
                colorScheme="teal"
                type="submit"
                className="button is-link"
              >
                {loading ? '...Loading':'Register'}
                
              </Button>
              <Button  colorScheme="teal" variant="outline" onClick={goToLogin}>
                Go to Login
              </Button>
            </HStack>
          </form>
        </VStack>
      </Box>
    </AuthWrapper>
  );
};

export default SignUp;
