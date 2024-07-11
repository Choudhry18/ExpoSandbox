import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function Scanner() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(true);
    if(!permission){
        return <View />
    }
    if (!permission.granted) {
        // Camera permissions are not granted yet.
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
    function handleBarCodeScanned({ type, data, bounds }) {
        if(isScanning){
            setIsScanning(false)
            console.log(`Barcode scanned! Type: ${type}, Data: ${data}`);
            Alert.alert(
              'Barcode Scanned',
              `Data: ${data}`,
              [
                {
                  text: 'OK',
                  onPress : () => {
                    setIsScanning(true)
                  }
                },
              ],
              { cancelable: false }
            );
        }
      }

    return (
        <View style={styles.container}>
        <CameraView 
        style={styles.camera} 
        facing ={facing}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr", "upc_a"],
          }}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            </View>
        </CameraView>
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
  });