import React, { useState, useEffect } from "react";
import DashboardLayoutBasic from "../components/DashboardLayout";
import { styled } from "@mui/material/styles";
import TestComponent from "../components/TestComponent";

const Skeleton = styled("div")<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function Dashboard() {
  return (
    <div>
      <h1>HELLO WORLD!!!! AI TRAVEL PLANNER AP!!!! SOFTWARE ENGINEERING!!!</h1>
      <TestComponent />
    </div>
  );
}
