import {
	Flex,
   Avatar,
	AvatarBadge,
	Text,
	Wrap,
	Stack,
	Box,
	Image,
	useColorMode,
	useColorModeValue,
  } from "@chakra-ui/react";
  import { useRecoilState, useRecoilValue } from "recoil";
  import userAtom from "../atoms/userAtom";
  import { BsCheck2All } from "react-icons/bs";
  import { selectedConversationAtom } from "../atoms/messagesAtom";
  
  const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage;
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const colorMode = useColorMode();
  
	console.log("selectedConversation", selectedConversation);
	return (
	  <Flex
		alignItems={"center"}
		p={"1"}
		_hover={{
			cursor: "pointer",
			bg: useColorModeValue("gray.600", "gray.dark"),
			color: "white",
		}}
		onClick={() =>
		  setSelectedConversation({
			_id: conversation._id,
			userId: user._id,
			userProfilePic: user.profilePic,
			username: user.username,
			mock: conversation.mock,
		  })
		}
		 bg={
		   selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.800") : "transparent"
		 }
		 borderRadius={"md"}
		 cursor={"pointer"}
	  >
		<Wrap>
		  <Avatar
			size="md"
			src={user.profilePic}
		  >
			{isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
		  </Avatar>
		</Wrap>
  
		<Stack direction="column" spacing="1">
		  <Text fontWeight="bold" display="flex" alignItems="center">
			{user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
		  </Text>
		  <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
					{currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							<BsCheck2All size={16} />
						</Box>
					) : (
						""
					)}
					{lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
				</Text>
		</Stack>
	  </Flex>
	);
  };
  
  export default Conversation;