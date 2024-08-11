// "use client"
// // import {Metadata} from 'next'
// import {ChatIcon} from "@chakra-ui/icons";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
// import { auth } from "../../../firebaseconfig";
// import { Box, Button, Center , Stack} from "@chakra-ui/react";
// export default  function Login(){
//     const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
//     return( 
//         <>
//                     <title>Login</title>
//         <Center
//         h= "100vh">
//             <Stack
//             align="center"
//             bgColor="purple.600"
//             p="16"
//             rounded="3xl"
//             spacing={12}
//             boxShadow="lg">
//             <Box
//             bgColor="blue.500"
//             w="fit-content"
//             p={5}
//             rounded="3xl"
//             boxShadow="md">
//             <ChatIcon w="100px" h="100px" color ="pink"/>

//             </Box>
//         <Button boxShadow="md" onClick={() => signInWithGoogle()}>
//             Sign In with Google
//         </Button>
//             </Stack>
       
//         </Center>
//         </>
//     )
// }

// "use client"; // Ensure this directive is at the top
// import Chat from "../chat/[id]/page";
// import { ChatIcon } from "@chakra-ui/icons";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
// import { auth } from "../../../firebaseconfig";
// import { Box, Button, Center, Stack } from "@chakra-ui/react";
// import { useRouter } from "next/navigation"; // Update import to next/navigation
// import { useEffect } from "react";

// export default function Login() {
//   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       const userId = user.uid; // Assuming `uid` is the user ID
//       router.push(`/chat/${userId}`); // Redirecting to the specific user's chat page
//     }
//   }, [user, router]);
  

//   return (
//     <>
//       <title>Login</title>
//       <Center h="100vh">
//         <Stack
//           align="center"
//           bgColor="purple.600"
//           p="16"
//           rounded="3xl"
//           spacing={12}
//           boxShadow="lg"
//         >
//           <Box
//             bgColor="blue.500"
//             w="fit-content"
//             p={5}
//             rounded="3xl"
//             boxShadow="md"
//           >
//             <ChatIcon w="100px" h="100px" color="pink" />
//           </Box>
//           <Button boxShadow="md" onClick={() => signInWithGoogle("",{prompt: "select_account"})}>
//             Sign In with Google
//           </Button>
//         </Stack>
//       </Center>
//     </>
//   );
// }

"use client"; // Ensure this directive is at the top
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseconfig";
import { Box, Button, Center, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatIcon } from "@chakra-ui/icons";
export default function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userId = user.user.uid; // Assuming `uid` is the user ID
      router.push(`/chat/${userId}`); // Redirecting to the specific user's chat page
    }
  }, [user, router]);

  return (
    <>
      <title>Login</title>
      <Center h="100vh">
        <Stack
          align="center"
          bgColor="purple.600"
          p="16"
          rounded="3xl"
          spacing={12}
          boxShadow="lg"
        >
          <Box
            bgColor="blue.500"
            w="fit-content"
            p={5}
            rounded="3xl"
            boxShadow="md"
          >
            <ChatIcon w="100px" h="100px" color="pink" />
          </Box>
          <Button boxShadow="md" onClick={() => signInWithGoogle("", { prompt: "select_account" })}>
            Sign In with Google
          </Button>
        </Stack>
      </Center>
    </>
  );
}
