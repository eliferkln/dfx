import styled from "styled-components";
import { Paper, Button, Box } from "@mui/material";

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const StyledPaper = styled(Paper)`
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ActionButton = styled(Button)`
  && {
    text-transform: none;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
  }
`;

export const DataGridContainer = styled(Box)`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;

  .MuiDataGrid-root {
    border: none;
    min-height: auto !important;
  }

  .MuiDataGrid-cell {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
    font-size: 14px;
  }

  .MuiDataGrid-columnHeaders {
    background-color: #fafafa;
    border-bottom: 2px solid #f0f0f0;
    min-height: 56px !important;
  }

  .MuiDataGrid-columnHeader {
    padding: 16px !important;
  }
`;

export const DialogContent = styled(Box)`
  padding: 24px;
  min-width: 400px;
`;

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding: 16px;
`;
