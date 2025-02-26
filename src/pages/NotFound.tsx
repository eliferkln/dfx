import { Typography, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  text-align: center;
  color: white;
`;

const ErrorCode = styled(Typography)`
  && {
    font-size: 120px;
    font-weight: 700;
    margin-bottom: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const BackButton = styled(Button)`
  && {
    margin-top: 32px;
    padding: 12px 32px;
    font-size: 16px;
    background: white;
    color: #667eea;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #f5f5f5;
    }
  }
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ErrorCode variant="h1">404</ErrorCode>
      <Typography variant="h4" gutterBottom>
        Sayfa Bulunamadı
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 500, mb: 4 }}>
        Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
      </Typography>
      <BackButton variant="contained" onClick={() => navigate("/")}>
        Ana Sayfaya Dön
      </BackButton>
    </NotFoundContainer>
  );
}
