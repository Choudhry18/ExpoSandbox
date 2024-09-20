import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import Tesseract from 'tesseract.js';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture(cameraRef : any) {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      extractText(photo.uri);
    }
  }

  const extractText = async (imageUri : any) => {
    setLoading(true);
    const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
    
    Tesseract.recognize(`data:image/jpeg;base64,${base64Image}`, 'eng', {
      logger: (m) => console.log(m),
    })
    .then(({ data: { text } }) => {
      setExtractedText(text);
      setLoading(false);
    })
    .catch((error) => {
      console.error('OCR error: ', error);
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => takePicture(cameraRef)}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {capturedImage && (
        <>
          <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
          {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Text>{extractedText}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imagePreview: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 20,
  },
});
