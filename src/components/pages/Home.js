import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import { storage } from "../../firebase.js";
import { database } from '../../firebase.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import { v4 } from "uuid";
import * as tf from '@tensorflow/tfjs';
import speciesNames from '../../speciesNames.json';
import Resizer from 'react-image-file-resizer';

const Home = ({ userId }) => {
  const [model, setModel] = useState(null)
  const [picture, setPicture] = useState(null);
  const [message, setMessage] = useState('');
  const [modelPicture, setModelPicture] = useState(null);
  const [name, setName] = useState('');
  const [pictureSet, setPictureSet] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const loadedModel = await tf.loadGraphModel('https://raw.githubusercontent.com/szywyk/mybirdie-app/master/model-EfficientNetB0-finetuning/model.json');
      setModel(loadedModel);

      // just a warm up for a model
      const warmupResult = loadedModel.predict(tf.zeros([1, 224, 224, 3], 'float32'));
      warmupResult.dataSync();
      tf.dispose(warmupResult);
    })();
  }, []);

  const runModel = () => {
    setPictureSet(false);
    let pic = document.getElementById('pic-to-predict');
    let tfTensor = tf.browser.fromPixels(pic)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    const pred = model.predict(tfTensor);
    pred.data().then((v) => {
      const values = v;
      tf.dispose(tfTensor);
      tf.argMax(pred, -1).data().then((prediction) => {
        const percent = values[prediction];
        const species = Object.keys(speciesNames)[prediction];
        setMessage(`Мы уверены на ${(percent * 100).toFixed(2)}% что это:`);
        setName(`${species}`);
        getDownloadURL(ref(storage, `birdsModelPictures/${species}/1.jpg`))
          .then(url => {
            setModelPicture(url);
          })
          .catch(error => {
            //pass
          })
      });
    });
  }

  const handleUploadClick = () => {
    inputRef.current?.click();
  }

  const handlePictureUpload = () => {
    const selectedFile = inputRef.current.files[0];
    if (selectedFile != null) {
      if (handlePictureCheck(selectedFile)) {
        try {
          Resizer.imageFileResizer(
            selectedFile,
            224,
            224,
            "JPEG",
            100,
            0,
            (uri) => {
              setPicture(uri);
              setPictureSet(true);
              setMessage('');
              setModelPicture(null);
              setName('');
            },
            "file"
          );
        } catch (err) {
          setMessage(err);
        }
      }
      else {
        setPicture(null);
        setPictureSet(false);
        setName('');
        setModelPicture(null);
        setMessage('Selected file is not a valid image.')
      }
    }
  }

  const handlePictureCheck = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(selectedFile.type)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const handlePicturePass = () => {
    if (picture) {
      const hash = v4();
      const storageRef = ref(storage, `images/${hash}`);
      uploadBytes(storageRef, picture).then(() => {
        setMessage(`${name} saved in 'My Birds'!`);
        getDownloadURL(storageRef).then((url) => {
          saveReference(userId, url, hash, name);
        });
        setPicture(null);
        setPictureSet(false);
        setModelPicture(null);
        setName('');
      });
    }
  }

  const handlePictureRemove = () => {
    setPicture(null);
    setPictureSet(false);
    setMessage('');
  }

  const saveReference = (userId, url, hash, name) => {
    set(dbRef(database, `pictures/users/${userId}/${hash}/name`), name);
    set(dbRef(database, `pictures/users/${userId}/${hash}/url`), url);
  }

  const handleYes = () => {
    if (userId) {
      handlePicturePass();
    } else {
      setModelPicture(null);
      setPictureSet(true);
      setName('');
      setMessage(`That's great! If you want to save your birds for later, please sign in.`)
    }
  }

  const handleNo = () => {
    setModelPicture(null);
    setPictureSet(true);
    setName('');
    setMessage('Try different picture.');
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col className="justify-content-center d-flex">
          <label className="mx-3 fw-bold fs-4">Загрузите фото с птичкой</label>
          <input ref={inputRef} className="d-none" type="file" onChange={handlePictureUpload} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="justify-content-center d-flex">
          <Button variant="outline-dark" onClick={handleUploadClick} className="fs-5">Загрузить</Button>
        </Col>
      </Row>
      {picture && (
        <Row className="mt-3">
          <Col className="justify-content-center d-flex">
            <img src={URL.createObjectURL(picture)} className="img-fluid" alt="Uploaded Bird" width={300} height={300} id="pic-to-predict" />
          </Col>
        </Row>
      )}
      {pictureSet && (
        <Row>
          <Col className="justify-content-center d-flex">
            <Button className="mt-3 mx-2 fs-5" variant="outline-dark" onClick={handlePictureRemove} >Удалить</Button>
            <Button className="mt-3 mx-2 fs-5" variant="outline-dark" onClick={runModel} >Проверить</Button>
          </Col>
        </Row>
      )}
      {message && (
        <Row className="mt-3">
          <Col className="justify-content-center d-flex fw-bold fs-4">
            {message}
          </Col>
        </Row>
      )}
      {name && (
        <Row className="mt-3">
          <Col className="justify-content-center d-flex fw-bold fs-2">
            {name}
          </Col>
        </Row>
      )}
      {modelPicture && (
        <>
          <Row className="mt-5">
            <Col className="justify-content-center d-flex fw-bold fs-4">
              Is this your bird?
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="justify-content-center d-flex">
              <img src={modelPicture} className="img-fluid" alt="Model Bird" width={300} height={300} id="model-pic" />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="justify-content-center d-flex">
              <Button className="mt-3 mb-3 mx-2 fw-bold" variant="outline-dark" onClick={handleYes}>Yes</Button>
              <Button className="mt-3 mb-3 mx-2 fw-bold" variant="outline-dark" onClick={handleNo}>No</Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Home;