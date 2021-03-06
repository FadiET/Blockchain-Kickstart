import React from "react";
import Head from 'next/Head';
import Header from './Header';
import { Container } from "semantic-ui-react";

const Layout = (props) => {
  return (
    <Container>
      <link
      async
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
      />
      <Header/>
      {props.children}
      </Container>
  );
};
export default Layout;
