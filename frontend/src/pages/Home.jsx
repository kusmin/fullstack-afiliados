import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import TransactionService from "../service/TransactionService";
import ProtectedLayout from "./ProtectedLayout";

const Home = () => {
  const [file, setFile] = useState(null);
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const searchTransactions = await TransactionService.allTransactions();
    const sortedTransactions = searchTransactions.data.sort(
      (a, b) => a.id - b.id
    );

    setTransactions(searchTransactions.data);
  };

  const handleTransactionClick = (transaction) => {
    if (transaction.status === "ERRO") {
      setSelectedTransaction(transaction);
      onOpen();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Error",
        description: "File are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      await TransactionService.upload(file);
      toast({
        title: "Sucess",
        description: "File submited",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err.message || "Submit file error. Check your information!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <Header />
      <Container maxW="container.lg" py={8}>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <VStack spacing="6" w="100%">
            <Box boxShadow="md" p={6} borderRadius="lg" w="100%">
              <form onSubmit={handleSubmit}>
                <FormControl id="transactionFile">
                  <FormLabel>Upload Transaction File</FormLabel>
                  <Input type="file" onChange={handleFileChange} />
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit" w="100%">
                  Submit Transaction File
                </Button>
              </form>
            </Box>
            {transactions && transactions.length > 0 && (
              <Box boxShadow="md" p={6} borderRadius="lg" w="100%">
                <Table variant="simple">
                  <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Date Created</Th>
                    <Th>Date Update</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((transaction) => (
                    <Tr
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      backgroundColor={
                        transaction.status === "ERRO"
                          ? "red.200"
                          : transaction.status === "PROCESSADO"
                          ? "green.200"
                          : "white"
                      }
                    >
                      <Td>{transaction.id}</Td>
                      <Td>{transaction.dataCriacao}</Td>
                      <Td>{transaction.dataUpdate}</Td>
                      <Td>{transaction.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
                </Table>
              </Box>
            )}
            {selectedTransaction && (
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Errors for transaction ID: {selectedTransaction.id}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <List>
                      {selectedTransaction.errors.map((error, index) => (
                        <ListItem key={index}>{error}</ListItem>
                      ))}
                    </List>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="teal" onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </VStack>
        </Flex>
      </Container>
    </ProtectedLayout>
  );
};

export default Home;
