import { Navbar, Nav, NavbarToggle, NavbarCollapse } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { HeaderProps } from "./Types";
import DefaultMenuIcon from "src/components/icons/MenuIcon";
import ToggleThemeButton from "src/components/ToggleThemeButton";

export default function HeaderBase({
    title,
    className,
    MenuIcon = DefaultMenuIcon
}: HeaderProps["functional"]) {
    return (
        <Navbar
            as="header"
            expand="lg"
            className={className}
        >
            <LinkContainer to="/">
                <Navbar.Brand>{title}</Navbar.Brand>
            </LinkContainer>

            <NavbarToggle 
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <MenuIcon />
            </NavbarToggle>
                
            <NavbarCollapse>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/space-gallery">
                        <Nav.Link>Space Gallery</Nav.Link>
                    </LinkContainer>
                </ul>

                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <ToggleThemeButton />
                </ul>
            </NavbarCollapse>
        </Navbar>
    );
}