import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ReactMarkdown from "react-markdown";

// Define message interface
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Define props interface
interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading?: boolean;
  itineraryStyle?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isLoading = false,
  itineraryStyle = false,
}) => {
  const theme = useTheme();
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage);
      setCurrentMessage("");
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If using itinerary style, render messages differently
  if (itineraryStyle && messages.length > 0) {
    // Just display the AI message content directly as an itinerary
    const itineraryMessage = messages.find((msg) => msg.sender === "ai");

    return (
      <Box
        sx={{
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "& h1": {
              fontSize: "1.5rem",
              fontWeight: 600,
              mb: 2,
              mt: 0,
              color: theme.palette.text.primary,
            },
            "& h2": {
              fontSize: "1.25rem",
              fontWeight: 500,
              mb: 1.5,
              color: theme.palette.text.primary,
            },
            "& p": {
              fontSize: "0.875rem",
              lineHeight: 1.6,
              mb: 1.5,
              color: theme.palette.text.primary,
            },
            "& ol, & ul": {
              pl: 2,
              mb: 2,
              color: theme.palette.text.primary,
            },
            "& li": {
              mb: 0.5,
              color: theme.palette.text.primary,
            },
            "& strong": {
              fontWeight: 600,
              color: theme.palette.text.primary,
            },
          }}
        >
          {itineraryMessage ? (
            <ReactMarkdown>{itineraryMessage.text}</ReactMarkdown>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No itinerary generated yet.
            </Typography>
          )}
        </Box>

        {/* Input area */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Ask for more details or modifications..."
            multiline
            maxRows={2}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{ mr: 1 }}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
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
      </Box>
    );
  }

  // Regular chat interface
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "calc(100vh - 240px)",
        minHeight: "500px",
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
          gap: 2,
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
            }}
          >
            <SmartToyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" color="text.primary">
              Start a conversation about your trip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Describe what kind of experience you're looking for
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                flexDirection:
                  message.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor:
                    message.sender === "user"
                      ? "primary.main"
                      : "secondary.main",
                  width: 36,
                  height: 36,
                }}
              >
                {message.sender === "user" ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor:
                    message.sender === "user"
                      ? "primary.main"
                      : theme.palette.mode === "dark"
                      ? "rgba(60, 60, 60, 0.9)"
                      : theme.palette.background.default,
                  color:
                    message.sender === "user"
                      ? "#fff"
                      : theme.palette.text.primary,
                  borderRadius: 2,
                  borderTopLeftRadius: message.sender === "user" ? 2 : 0,
                  borderTopRightRadius: message.sender === "ai" ? 2 : 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    message.sender === "user"
                      ? "rgba(255,255,255,0.7)"
                      : "text.secondary"
                  }
                  sx={{ display: "block", mt: 1 }}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 36,
                height: 36,
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: "70%",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(60, 60, 60, 0.9)"
                    : theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: 2,
                borderTopLeftRadius: 0,
              }}
            >
              <Typography variant="body1">Thinking...</Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          multiline
          maxRows={4}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{ mr: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isLoading}
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
