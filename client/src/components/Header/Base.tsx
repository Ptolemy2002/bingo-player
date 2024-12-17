import { Navbar, Nav, NavbarToggle, NavbarCollapse } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { HeaderProps } from "./Types";
import MenuIcon from "src/components/icons/MenuIcon";
import ToggleThemeLightDarkButton from "src/components/ToggleThemeLightDarkButton";

export default function HeaderBase({title, className}: HeaderProps) {
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
                </ul>

                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <ToggleThemeLightDarkButton />
                </ul>
            </NavbarCollapse>
        </Navbar>
    );
}