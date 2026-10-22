import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GameText } from './GameText';
import { Panel } from './Panel';
import { colors, MAX_WIDTH } from './theme';

interface Props {
  visible: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  testID?: string;
}

export function GameModal({ visible, title, onClose, children, testID }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop} testID={testID}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="close-backdrop" />
        <Panel title={title} style={styles.panel}>
          {onClose ? (
            <Pressable accessibilityRole="button" accessibilityLabel="close" style={styles.close} onPress={onClose}>
              <GameText size={16} weight="black" color={colors.textLight} outline>
                ✕
              </GameText>
            </Pressable>
          ) : null}
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </Panel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 16 },
  panel: { width: '100%', maxWidth: MAX_WIDTH - 32, maxHeight: '88%' },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: { gap: 12 },
  close: {
    position: 'absolute',
    top: 4,
    right: 6,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.redDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
