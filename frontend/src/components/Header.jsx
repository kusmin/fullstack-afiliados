import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    window.location.replace('/login');
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.0rem"
      bg="teal.500"
      color="white"
    >
      <Box>
        <FiUser size="1.5em" />
      </Box>
      <Spacer />
      <Box>
        <Button colorScheme="white" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
