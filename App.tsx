import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RNFS from 'react-native-fs';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useFrameProcessor,
  useMicrophonePermission,
  
} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const App = () => {
  const isDarkMode = false;
  const cameraRef: any = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [recording, setRecording] = useState(false);
  const [recordingPaused, setRecordingPaused] = useState(false)

  let device: any = useCameraDevice(cameraPosition , {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ]
  });

  const onFlipCameraPressed = () => {
    if (cameraPosition === 'front') {
      setCameraPosition('back');
    } else {
      setCameraPosition('front');
    }
  };

  const recordVideo = async () => {
    setRecording(true);
    await cameraRef.current.startRecording({
      onRecordingFinished: (video: any) => {
        const filePath = RNFS.DocumentDirectoryPath + video.path;
        // Write the file
        //  RNFS.copyFileAssets(video.path, filePath);

        // Add the image to the Camera Roll
        CameraRoll.saveToCameraRoll(video.path, 'video');
        // RNFS.writeFile(filePath, video.path)
        //   .then(res => {
        //     console.log('res', res);
        //   })
        //   .catch(err => {
        //     console.log('err', err);
        //   });
      },
      onRecordingError: (error: any) => console.error('error', error),
    });
  };

  const stopRecordingVideo = async () => {
    setRecording(false);
    cameraRef.current.stopRecording();
  };

  const pauseAndResume = async () => {
    if (recording) {
      if (recordingPaused) {
        await cameraRef.current.resumeRecording();
        setRecordingPaused(false)
      } else {
        await cameraRef.current.pauseRecording();
        setRecordingPaused(true)
      }
    }
  };

  if (device == null) return <View></View>;


  return (
    <View style={{height: '100%'}}>
      <View style={{height: '90%'}}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          audio={true}
          video={true}
        />
      </View>
      <View
        style={{
          height: '10%',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={pauseAndResume}
          disabled={recording ? false : true}
          style={{backgroundColor: 'red', padding: 10}}
          activeOpacity={1}>
          <Text>{recordingPaused ? "Resume" : "Pause"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'red', padding: 10}}
          activeOpacity={1}
          onPress={recording ? stopRecordingVideo : recordVideo}>
          <Text>{recording ? 'Stop Recording' : 'Start Recording '}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'red', padding: 10}}
          activeOpacity={1}
          onPress={onFlipCameraPressed}>
          <Text>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
