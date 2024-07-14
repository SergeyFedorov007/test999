import { Card, Button, Col } from "react-bootstrap";
import { database } from "../firebase";
import { ref, remove } from "firebase/database";

const MyBird = ({ url, name, picId, userId }) => {
  
  const handlePictureRemove = () => {
    const pictureRef = ref(database, `/pictures/users/${userId}/${picId}`);
    remove(pictureRef);
  }

  return (
    <Col>
      <Card>
        <Card.Img variant="top" src={url} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Button onClick={handlePictureRemove} variant="outline-dark">Remove</Button>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default MyBird;