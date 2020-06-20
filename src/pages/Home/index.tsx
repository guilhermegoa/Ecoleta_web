import React from "react";
import { Link } from 'react-router-dom';
import { FiLogIn } from "react-icons/fi";

import {
  ContainerHome,
  Container,
  Header,
  Main,
  Title,
  Description,
  Button,
} from "./styles";

import logo from "../../assets/logo.svg";

const Home = () => {
  return (
    <ContainerHome>
      <Container>
        <Header>
          <img src={logo} alt="Ecoleta" />
        </Header>
        <Main>
          <Title>Seu marktplace de coleta de resíduos</Title>
          <Description>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Description>
          <Link to="/create-point">
            <Button>
              <span>
                <FiLogIn />
              </span>
              <strong>Cadastre um ponto de coleta</strong>
            </Button>
          </Link>
        </Main>
      </Container>
    </ContainerHome>
  );
};

export default Home;
