"use client";
import Login from "./component/login";
import { ChakraProvider } from "@chakra-ui/react";
import Sidebar from "./component/sidebar"; 
import { auth } from "../../firebaseconfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spinner } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
export default function Authentication(){
const [user, loading, error] = useAuthState(auth);

if (true) {
  return (
    <ChakraProvider>
        <Center>
        </Center>
    </ChakraProvider>
  );
}
if (user) {
    return (
      <ChakraProvider>
        <Sidebar />
        {/* Add any other components or logic for authenticated users here */}
      </ChakraProvider>
    );
  }
  if(!user){
    return(
        <ChakraProvider>
        < Login />

        </ChakraProvider>
    )
  }
}