import React from "react";
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "./FooterStyles";

const Footer = () => {
return (
	<Box>
	<h3 style={{ color: "purple",
				textAlign: "center",
				marginTop: "-50px" }}>
		A simple react footer by WathikAhmed
	</h3>
	<Container>
		<Row>
		<Column>
			<Heading>About Us</Heading>
			<FooterLink href="https://github.com/John8790909/CONNECT/blob/main/TERMS%26CONDITIONS.md">Terms and Conditions</FooterLink>
			<FooterLink href="https://github.com/John8790909/CONNECT/blob/main/LICENSE">License</FooterLink>
		</Column>
		<Column>
			<Heading>Services</Heading>
			<FooterLink href="#">Programming</FooterLink>
		</Column>
		<Column>
			<Heading>Contact Us</Heading>
			<FooterLink href="https://github.com/WathikAhmed">WathikAhmed</FooterLink>
		</Column>
		<Column>
			<Heading>Social Media</Heading>
			
			<FooterLink href="#">
			<i className="fab fa-twitter">
				<span style={{ marginLeft: "10px" }}>
				Twitter
				</span>
			</i>
			</FooterLink>
		</Column>
		</Row>
	</Container>
	</Box>
);
};
export default Footer;
