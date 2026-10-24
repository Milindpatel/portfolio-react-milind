import { useState } from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

export default function PortButtonDropdown({ items }) {
  const [open, setOpen] = useState(false);

  return (
    <ButtonDropdown className="port-dropdown" isOpen={open} toggle={() => setOpen(!open)}>
      <DropdownToggle caret size="sm" aria-label="Actions" />
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem key={item.text} {...item.handlers}>
            {item.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
}
