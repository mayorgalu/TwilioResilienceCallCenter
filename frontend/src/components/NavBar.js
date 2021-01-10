import React from "react";
import { Container, Menu, Image } from "semantic-ui-react";

function NavBar() {
  return (
    <Menu>
      {" "}
      //chapter 26
      <Container text>
        <Menu.Item>
          <i className="phone icon"></i>
        </Menu.Item>
        <Menu.Item header>Resiliency Connection Call Center</Menu.Item>
        <Menu.Item position="right">
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/chris.jpg"
            avatar
          />
        </Menu.Item>
        <Menu.Item>Chris</Menu.Item> //chapter 26
      </Container>
    </Menu>
  );
}

export default NavBar;
