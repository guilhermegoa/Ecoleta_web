import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
  --primary-color: #34CB79;
  --title-color: #322153;
  --text-color: #6C6C80;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

body {
  background: #F0F0F5;
  -webkit-font-smoothing: antialiased;
  color: var(--text-color);
}

body, input, button {
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--title-color);
  font-family: Ubuntu;
}

`;

export default GlobalStyle;
