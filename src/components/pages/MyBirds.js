import { Container, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import MyBird from '../MyBird';

const MyBirds = ({ userId }) => {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const picsRef = ref(database, `/pictures/users/${userId}`);
    onValue(picsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pics = [];
        pics.push(Object.entries(data));
        setPictures(Object.entries(data));
      } else {
        //pass
      }
    });
  }, [userId]);
  const picturesToDisplay = pictures.map((arr) => <MyBird url={arr[1].url} name={arr[1].name} picId={arr[0]} userId={userId} key={arr[1].url} />);

  return (
    <Container className="mt-3">
      <Row className="justify-content-center fw-bold fs-2 mb-3">My Birds</Row>
      {pictures.length === 0 && (
        <Row className="justify-content-center fs-4 mb-3 mt-5">You have no saved birds yet.</Row>
      )}
      {pictures && (
        <Row xs={2} md={3} lg={5}>
          {picturesToDisplay}
        </Row>
      )}
    </Container>
  );
}

export default MyBirds;