import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
import { login, logout } from '../../lib/auth0';

function NavLink({ href, title, className = '' }) {
  const { asPath } = useRouter();
  const active = asPath === href ? 'active' : '';
  return (
    <Link href={href} className={`nav-link port-navbar-link ${className} ${active}`}>
      {title}
    </Link>
  );
}

function BlogMenu({ isSiteOwner }) {
  const [open, setOpen] = useState(false);

  if (!isSiteOwner) {
    return (
      <NavItem className="port-navbar-item">
        <NavLink href="/blogs" title="Blog" />
      </NavItem>
    );
  }

  return (
    <Dropdown className="port-navbar-link port-dropdown-menu" nav isOpen={open} toggle={() => setOpen(!open)}>
      <DropdownToggle className="port-dropdown-toggle" nav caret>
        Blog
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem tag="div"><NavLink className="port-dropdown-item" href="/blogs" title="Blogs" /></DropdownItem>
        <DropdownItem tag="div"><NavLink className="port-dropdown-item" href="/blogs/new" title="Create a Blog" /></DropdownItem>
        <DropdownItem tag="div"><NavLink className="port-dropdown-item" href="/blogs/dashboard" title="Blogs Dashboard" /></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function Header({ isAuthenticated, isSiteOwner, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className={`port-navbar port-nav-base absolute ${className} ${isOpen ? 'menu-open' : 'menu-close'}`} color="transparent" dark expand="md">
      <NavbarBrand className="port-navbar-brand" tag={Link} href="/">
        Milind Patel
      </NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          <NavItem className="port-navbar-item"><NavLink href="/" title="Home" /></NavItem>
          <NavItem className="port-navbar-item"><NavLink href="/about" title="About" /></NavItem>
          <NavItem className="port-navbar-item"><NavLink href="/portfolios" title="Portfolio" /></NavItem>
          <BlogMenu isSiteOwner={isSiteOwner} />
          <NavItem className="port-navbar-item"><NavLink href="/cv" title="CV" /></NavItem>
          <NavItem className="port-navbar-item">
            <button type="button" onClick={isAuthenticated ? logout : login} className="nav-link port-navbar-link btn btn-link">
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
