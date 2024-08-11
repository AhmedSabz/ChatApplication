
import Login from "./component/login";
import { ChakraProvider } from "@chakra-ui/react";
import Sidebar from "./component/sidebar"; 
import { auth } from "../../firebaseconfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spinner } from "@chakra-ui/react";
export const metadata = {
  title: 'Login'
}

export default function Home() {

 

  return (
    <ChakraProvider>
      <Login />
    </ChakraProvider>
  );
}
