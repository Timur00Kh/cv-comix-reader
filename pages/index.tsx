import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setExample } from '@/store/example';
import Head from 'next/head';
import { Col, Container, Row } from 'reactstrap';

export default function Home(): JSX.Element {
  return (
    <Container>
      <Row>
        <Col>123</Col>
      </Row>
    </Container>
  );
}
