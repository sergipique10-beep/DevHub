import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  html {
    scrollbar-color: ${({ theme }) => theme.colors.accentViolet} transparent;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.body};
    background: ${({ theme }) => theme.colors.background};
    background-image:
      radial-gradient(circle at 12% 0%, rgba(56, 189, 248, 0.16) 0%, transparent 42%),
      radial-gradient(circle at 88% 18%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
      radial-gradient(circle at 50% 100%, rgba(34, 211, 238, 0.08) 0%, transparent 55%);
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: ${({ theme }) => theme.font.heading};
    letter-spacing: 0.2px;
  }

  p {
    margin: 0;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentViolet};
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.accentCyan}, ${({ theme }) => theme.colors.accentViolet});
    border-radius: 999px;
  }

  .Toastify__toast {
    font-family: ${({ theme }) => theme.font.body};
    background: ${({ theme }) => theme.colors.surfaceSolid} !important;
    color: ${({ theme }) => theme.colors.text} !important;
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;
