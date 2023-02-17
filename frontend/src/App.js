import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/global";
import Form from "./components/Form";
import Grid from "./components/Grid";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaMoon, FaSun } from "react-icons/fa";

const lightTheme = {
  background: "#F4F4F4",
  text: "#2D2D2D",
  border: "#CCC",
};

const darkTheme = {
  background: "#2D2D2D",
  text: "#F4F4F4",
  border: "#888",
};

const PageTitle = styled.h1`
  font-size: 36px;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.text};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  padding: 20px 0;
`;

const PanelContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 20px;
  background: ${({ theme }) => theme.background};
  justify-content: flex-start;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  justify-content: flex-start;
`;

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [setUsers]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyle />
        <PageTitle>USUÁRIOS</PageTitle>
        <PanelContainer>
          <Button
            className="button"
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              background: "transparent",
              border: "none",
              alignSelf: "flex-start",
            }}
          >
            {theme === "light" ? (
              <FaMoon style={{ marginRight: "25px" }} />
            ) : (
              <FaSun style={{ marginRight: "25px" }} />
            )}{" "}
          </Button>

          <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
          <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
          <ToastContainer
            autoClose={3000}
            position={toast.POSITION.BOTTOM_LEFT}
          />
          <GlobalStyle />
        </PanelContainer>
      </>
    </ThemeProvider>
  );
}

export default UsersPanel;
