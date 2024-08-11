// "use client"
// import { IconButton } from "@chakra-ui/react"
// import { ArrowLeftIcon } from "@chakra-ui/icons"
// import { Flex,Text} from "@chakra-ui/react"
// import { Button } from "@chakra-ui/react"
// import { Avatar } from "@chakra-ui/react"
// import { signOut } from "firebase/auth"
// import { auth } from "../../../firebaseconfig"
// const Chat =() => {
//     return (
//         <Flex padding={3} align="center" _hover={{bg: "gray.100",cursor: "pointer"}}>
//         <Avatar src="" marginEnd={3}/> 
//         <Text>user@gmail.com</Text>
//     </Flex>
//     )
// }
// export default function Sidebar(){
//     return (
//         <Flex
//         // bg="blue.100"
//         w="300px"
//         h="100vh"
//         borderEnd="1px solid"
//         borderColor="gray.200"
//         direction="column">
//             <Flex 
//             h="81px"
//             // bg="red.100"
//             w="100%"
//             align ="center"
//            justifyContent="space-between"
//            p={3}
//            borderBottom="1px solid"
//            borderColor="gray.200"
//            >
//             <Flex align="center">
//             <Avatar src="" marginEnd={3}/>
//             <Text>Albert Einstein</Text>

//             </Flex>
//             <IconButton size ="sm" isRound icon={<ArrowLeftIcon />} onClick= {() => signOut(auth)}/>
//             </Flex>
//             <Button p={4} m={5}>New Chat</Button>
//             <Flex overflowX="scroll" direction="column" sx={{scrollbarWidth: "none"}}flex={1}>
//             <Chat />
            
//             </Flex>
//         </Flex>
//     )
// }

// "use client";
// import { useRouter } from "next/navigation";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { IconButton } from "@chakra-ui/react";
// import { ArrowLeftIcon } from "@chakra-ui/icons";
// import { Flex, Text, Button, Avatar } from "@chakra-ui/react";
// import { signOut } from "firebase/auth";
// import { useEffect } from "react";
// import { auth } from "../../../firebaseconfig";

// const Chat = () => {
//   return (
//     <Flex padding={3} align="center" _hover={{ bg: "gray.100", cursor: "pointer" }}>
//       <Avatar src="" marginEnd={3} />
//       <Text>user@gmail.com</Text>
//     </Flex>
//   );
// };

// export default function Sidebar() {
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   const handleSignOut = () => {
//     signOut(auth);
//   };

//   useEffect(() => {
//     if (!user) {
//       router.push("/"); // Redirect to the login page
//     }
//   }, [user, router]);

//   return (
//     <Flex
//       w="300px"
//       h="100vh"
//       borderEnd="1px solid"
//       borderColor="gray.200"
//       direction="column"
//     >
//       <Flex
//         h="81px"
//         w="100%"
//         align="center"
//         justifyContent="space-between"
//         p={3}
//         borderBottom="1px solid"
//         borderColor="gray.200"
//       >
//         <Flex align="center">
//           <Avatar src="" marginEnd={3} />
//           <Text>Albert Einstein</Text>
//         </Flex>
//         <IconButton
//           size="sm"
//           isRound
//           icon={<ArrowLeftIcon />}
//           onClick={handleSignOut}
//         />
//       </Flex>
//       <Button p={4} m={5}>New Chat</Button>
//       <Flex overflowX="scroll" direction="column" sx={{ scrollbarWidth: "none" }} flex={1}>
//         <Chat />
//       </Flex>
//     </Flex>
//   );
// }

"use client";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconButton } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Flex, Text, Button, Avatar } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { auth, db } from "../../../firebaseconfig";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import getOtherEmail from '../../../utils/getOtherEmail';

export default function Sidebar() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const redirect = (id) => {
    router.push(`/chat/${id}`);
  }

  const chatExists = email => chats?.find(chat => (chat.users.includes(user.email) && chat.users.includes(email)));

  const newChat = async () => {
    const input = prompt("Enter email of chat recipient");
    if (!chatExists(input) && (input !== user.email)) {
      await addDoc(collection(db, "chats"), {
        users: [user.email, input],
        timestamp: serverTimestamp()
      });
    }
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/"); // Redirect to the home page after signing out
  };

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/"); // Redirect to the login page if user is not authenticated
    }
  }, [user, loadingAuth, router]);

  const chatList = () => {
    if (!user) return null; // Ensure user is defined before accessing its properties

    const uniqueEmails = new Set(); // To track unique email addresses

    return (
      chats?.filter(chat => chat.users.includes(user.email)).map(chat => {
        const otherEmail = getOtherEmail(chat.users, user);
        if (uniqueEmails.has(otherEmail)) return null; // Skip if email is already added
        uniqueEmails.add(otherEmail);

        return (
          <Flex key={chat.id} padding={3} align="center" _hover={{ bg: "gray.100", cursor: "pointer" }} onClick={() => redirect(chat.id)}>
            <Avatar src="" marginEnd={3} />
            <Text>{otherEmail}</Text>
          </Flex>
        );
      })
    );
  };

  if (loadingAuth || loading) {
    return <div>Loading...</div>; // Add a loading state if necessary
  }

  return (
    <Flex
      w="300px"
      h="100%"
      borderEnd="1px solid"
      borderColor="gray.200"
      direction="column"
    >
      <Flex
        h="81px"
        w="100%"
        align="center"
        justifyContent="space-between"
        p={3}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Flex align="center">
          <Avatar src={user?.photoURL || ""} marginEnd={3} />
          <Text>{user?.displayName || "Unknown User"}</Text>
        </Flex>
        <IconButton
          size="sm"
          isRound
          icon={<ArrowLeftIcon />}
          onClick={handleSignOut}
        />
      </Flex>
      <Button p={4} m={5} onClick={newChat}>New Chat</Button>
      <Flex overflowX="scroll" direction="column" sx={{ scrollbarWidth: "none" }} flex={1}>
        {chatList()}
      </Flex>
    </Flex>
  );
}
