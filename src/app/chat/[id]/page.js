// "use client"
// import { Avatar } from "@chakra-ui/react"
// import { Flex,Heading } from "@chakra-ui/react"
// import Sidebar from "@/app/component/sidebar"
// import { Input } from "@chakra-ui/react"
// import { Button } from "@chakra-ui/react"
// import { FormControl } from "@chakra-ui/react"
// import { Text } from "@chakra-ui/react"
// import { ChakraProvider } from "@chakra-ui/react"
// import Head from "next/head"
// import { useRouter } from "next/router"
// const Topbar =() => {
//     return(
//         <Flex
//         bg="gray.100"
//         h="81px"
//         w="100%"
//         align="center"
//         p={5}>
//             <Avatar src="" marginEnd={3} />
//             <Heading size="lg">
//                 user@gmail.com
//             </Heading>
//         </Flex>
//     )
// }
// const Bottombar =() => {
//     return (
//         <FormControl
//         p={3}
//         >
//             <Input placeholder="Type a message..."/>
//             <Button type="submit" hidden autoComplete="off">Submit</Button>
//         </FormControl>
//     )
// }
// export default function Chat(){
//     const router= useRouter();
//     const {id} = router.query;
//     return (
//         <ChakraProvider>
//             <Flex 
//             h="100vh">
//             <Sidebar/>
//             <Flex
//             flex={1}
//             direction="column">
//             < Topbar />
//             <Flex
//             flex={1} direction="column" pt={4} mx={5} overflowX="scroll" sx={{scrollbarWidth: "none"}}>
//                 <Flex bg="blue.100"
//                 w="fit-content" minWidth="100px" borderRadius="lg" p={3} m={1}>
//                     <Text>This is a dummy message</Text>
//                 </Flex>
//                 <Flex bg="blue.100"
//                 w="fit-content" minWidth="100px" borderRadius="lg" p={3} m={1}>
//                     <Text>dummy</Text>
//                 </Flex>
//                 <Flex bg="green.100"
//                 w="fit-content" minWidth="100px" borderRadius="lg" p={3} m={1} alignSelf="flex-end">
//                     <Text>This is a dummy message</Text>
//                 </Flex>
//             </Flex>
//             <Bottombar />
//             </Flex>
//             </Flex>
//         </ChakraProvider>
//     )
// }
"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar, Flex, Heading, ChakraProvider, Text, Input, Button, FormControl } from "@chakra-ui/react";
import Sidebar from "@/app/component/sidebar";
import { useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../../../firebaseconfig";
import { collection, query, orderBy, addDoc, doc, serverTimestamp } from "firebase/firestore";
import getOtherEmail from "../../../../utils/getOtherEmail";

const Topbar = ({ email }) => {
    return (
        <Flex bg="gray.100" h="81px" w="100%" align="center" p={5}>
            <Avatar src="" marginEnd={3} />
            <Heading size="lg">{email}</Heading>
        </Flex>
    );
};

const Bottombar = ({ id, email }) => {
    const [input, setInput] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, `chats/${id}/messages`), {
            text: input,
            timestamp: serverTimestamp(),
            sender: email,
        });
        setInput("");
    };

    return (
        <FormControl p={3} onSubmit={sendMessage} as="form">
            <Input
                placeholder="Type a message..."
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" hidden onClick={e => sendMessage(e)}>
                Submit
            </Button>
        </FormControl>
    ); 
};

export default function Chat() {
    const [user] = useAuthState(auth);
    const params = useParams();
    const { id } = params;
    console.log(user);
    const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
    const [messages] = useCollectionData(q);
    const [chat] = useDocumentData(doc(db, "chats", id));
    const bottomOfChat = useRef(null);

    useEffect(() => {
        if (bottomOfChat.current) {
            bottomOfChat.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const getMessages = () =>
        messages?.map((msg) => (
            <Flex
                key={Math.random()}
                bg={msg.sender === user?.email ? "green.100" : "blue.100"}
                w="fit-content"
                minWidth="100px"
                borderRadius="lg"
                p={3}
                m={1}
                alignSelf={msg.sender === user?.email ? "flex-end" : null}
            >
                <Text>{msg.text}</Text>
            </Flex>
        ));

    if (!user) {
        return <Text>Loading...</Text>; // or any loading indicator or message
    }

    return (
        <ChakraProvider>
            <Flex h="100vh">
                <Sidebar />
                <Flex flex={1} direction="column">
                    <Topbar email={getOtherEmail(chat?.users, user)} />
                    <Flex
                        flex={1}
                        direction="column"
                        pt={4}
                        mx={5}
                        overflowX="scroll"
                        sx={{ scrollbarWidth: "none" }}
                    >
                        {getMessages()}
                        <div ref={bottomOfChat}></div>
                        <Bottombar id={id} email={user.email} />
                    </Flex>
                </Flex>
            </Flex>
        </ChakraProvider>
    );
}
