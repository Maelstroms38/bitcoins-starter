import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function Coin(props) {
  const { coin, onPress } = props;
  const { symbol, name, price } = coin;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress()}
    >
      <View style={styles.row}>
        <Text style={styles.text} numberOfLines={1}>
          {symbol}
        </Text>
        <View style={styles.right}>
          <Text style={styles.text} numberOfLines={1}>
            {price}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.name]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  right: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  name: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '500'
  }
});
