import { Head } from '@/components/Head';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/root-reducer';
import {
  Button,
  ButtonDropdown,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'reactstrap';
import {
  ISettings,
  ReadOrder,
  setSettings as dispatchSettings
} from '@/store/settings';

export default function Other(): JSX.Element {
  const settings = useSelector((s: RootState) => s.settings);
  const dispatch = useDispatch();
  const setSettings = (e: ISettings) => dispatch(dispatchSettings(e));

  const [dropdownOpen, setOpen] = useState(false);
  const dropDownItems = [
    {
      id: ReadOrder.leftToRight,
      text: 'Left to right'
    },
    {
      id: ReadOrder.rightToLeft,
      text: 'Right to left'
    }
  ];
  const currentReadOrder = dropDownItems.find(
    (e) => e.id === settings.readOrder
  );

  const toggle = () => setOpen(!dropdownOpen);

  return (
    <Container>
      <Row style={{ justifyContent: ' center', padding: '12px' }}>
        <Col xs={12} style={{ maxWidth: '600px' }}>
          <Row className="justify-content-between">
            <Col xs="auto">
              <h1>Read Order:</h1>
            </Col>
            <Col xs="auto">
              <ButtonDropdown
                direction="left"
                isOpen={dropdownOpen}
                toggle={toggle}
              >
                <DropdownToggle caret>{currentReadOrder.text}</DropdownToggle>
                <DropdownMenu>
                  {dropDownItems.map((item) => (
                    <DropdownItem
                      active={item.id === settings.readOrder}
                      key={item.id}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          readOrder: item.id
                        })
                      }
                    >
                      {item.text}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
            </Col>
          </Row>
          <Row className="justify-content-between mt-3">
            <Col xs="auto">
              <h1>Debug hint:</h1>
            </Col>
            <Col xs="auto">
              <Button
                style={{ width: '100px' }}
                outline
                color={settings.showDebugHint ? 'success' : 'danger'}
                onClick={() =>
                  setSettings({
                    ...settings,
                    showDebugHint: !settings.showDebugHint
                  })
                }
              >
                {settings.showDebugHint ? 'ON' : 'OFF'}
              </Button>{' '}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
