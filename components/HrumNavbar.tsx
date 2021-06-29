import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HrumNavbar = (props) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  const router = useRouter();
  useEffect(() => {
    setCollapsed(true);
  }, [router.asPath]);

  return (
    <div style={{ padding: '0 12px', borderBottom: 'purple 2px solid' }}>
      <Navbar color="faded" light>
        <Link href="/">
          <NavbarBrand className="mr-auto">Comics Reader</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <Link href="/settings">
                <NavLink>Settings</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <NavLink href="#">Catalog</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default HrumNavbar;
