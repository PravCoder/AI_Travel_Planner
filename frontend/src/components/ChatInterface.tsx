import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";

// Re-export ChatMessageProps as ChatMessageType
export type ChatMessageType = ChatMessageProps;

// Define props interface
interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

/**
 * ChatInterface component that provides a complete chat experience with
 * message input, message display, and loading indicators.
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.6)"
              : "rgba(248, 249, 250, 1)",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: theme.palette.text.secondary,
              textAlign: "center",
              p: 3,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" color="text.primary">
              Start a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask me about your travel plans or for recommendations
            </Typography>
          </Box>
        ) : (
          <>
            {/* Map through messages and use our ChatMessage component */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                text={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            {/* Show loading indicator when waiting for response */}
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  ml: 6,
                  mt: 1,
                }}
              >
                <CircularProgress size={20} thickness={4} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  Thinking...
                </Typography>
              </Box>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      <Divider />

      {/* Message input area */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor:
            theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.6)" : "#f8f9fa",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          multiline
          maxRows={3}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          sx={{
            height: 40,
            width: 40,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
