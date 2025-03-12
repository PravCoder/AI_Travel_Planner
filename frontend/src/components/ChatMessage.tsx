import React from "react";
import { Box, Paper, Avatar, Typography, useTheme } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ReactMarkdown from "react-markdown";

export interface ChatMessageProps {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/**
 * ChatMessage component that displays a single message in the chat interface
 * with appropriate styling for user vs AI messages.
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  text,
  sender,
  timestamp,
}) => {
  const theme = useTheme();
  const isUser = sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 1.5,
        my: 1.5,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: isUser ? "primary.main" : "secondary.main",
          width: 38,
          height: 38,
        }}
      >
        {isUser ? <PersonIcon /> : <SmartToyIcon />}
      </Avatar>

      {/* Message content */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: "75%", // Wider for better readability
          minWidth: "200px",
          bgcolor: isUser
            ? "primary.main"
            : theme.palette.mode === "dark"
            ? "rgba(60, 60, 60, 0.9)"
            : theme.palette.background.default,
          color: isUser ? "#fff" : theme.palette.text.primary,
          borderRadius: 2,
          borderTopLeftRadius: !isUser ? 0 : 2,
          borderTopRightRadius: isUser ? 0 : 2,
        }}
      >
        {/* If AI message, render as markdown for formatting */}
        {isUser ? (
          <Typography variant="body1">{text}</Typography>
        ) : (
          <Box
            sx={{
              "& p": { my: 1 },
              "& ul, & ol": { pl: 2 },
              "& li": { mb: 0.5 },
              "& code": {
                bgcolor: "rgba(0, 0, 0, 0.1)",
                px: 0.5,
                borderRadius: 0.5,
                fontFamily: "monospace",
              },
            }}
          >
            <ReactMarkdown>{text}</ReactMarkdown>
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            textAlign: isUser ? "right" : "left",
            opacity: 0.8,
          }}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;
