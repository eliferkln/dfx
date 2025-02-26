import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { StyledPaper as StyledPaperMUI } from "../styles/StyledComponents";
import { ActionButton } from "../styles/StyledComponents";
import { useAuth } from "../hooks/useAuth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
 
`;

const LoginCard = styled(StyledPaperMUI)`
  && {
    padding: 40px;
    width: 100%;
    max-width: 450px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

const LoginButton = styled(ActionButton)`
  && {
    margin-top: 32px;
    height: 52px;
    font-size: 16px;
    background: linear-gradient(45deg, #667eea 30%, #764ba2 90%);
    box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);

    &:hover {
      background: linear-gradient(45deg, #764ba2 30%, #667eea 90%);
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .lock-icon {
    background: linear-gradient(45deg, #667eea 30%, #764ba2 90%);
    border-radius: 50%;
    padding: 16px;
    color: white;
    font-size: 60px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 8px;

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #667eea;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      transition: border-color 0.3s ease;
    }

    .Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #667eea !important;
    }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: formData.email });
    navigate("/dashboard");
  };

  return (
    <LoginContainer>
      <LoginCard elevation={0}>
        <IconWrapper>
          <LockOutlinedIcon className="lock-icon" />
        </IconWrapper>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600 }}
        >
         Hazır Mesaj & Kullanıcı Yönetimi
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          Lütfen giriş yapınız
        </Typography>
        <LoginForm onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <StyledTextField
            fullWidth
            label="Şifre"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <LoginButton type="submit" variant="contained" fullWidth>
            Giriş Yap
          </LoginButton>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}
