import React from 'react';
import { ActivityIndicator,StyleSheet,Text,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoadingState = ({
  text = 'Chargement...',
  fullScreen = true,
  size = 'large',
}) => {
  const content = (
    <View style={[
      styles.container,
      !fullScreen && styles.inlineContainer,
    ]}>
      <ActivityIndicator size={size} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineContainer: {
    flex: 0,
    paddingVertical: 15,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgb(180, 180, 230)',
    fontWeight: '500',
  },
});

export default LoadingState;