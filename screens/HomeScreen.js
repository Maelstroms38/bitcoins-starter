import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Coin from '../components/Coin';
import { MonoText } from '../components/StyledText';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// FlatList
// Auto-scroll index support
// Performant, immutable data source

const BITCOINS_QUERY = gql`
  query Bitcoins($offset: Int, $limit: Int) {
    bitcoins(offset: $offset, limit: $limit) {
      name
      imageUrl
      symbol
      price
    }
  }
`;

export default function HomeScreen(props) {
  const { navigation } = props;
  const { data, fetchMore, error } = useQuery(BITCOINS_QUERY, {
    variables: {
      offset: 0,
      limit: 10
    },
    fetchPolicy: 'cache-and-network'
  });
  if (!data || !data.bitcoins || error) {
    console.log(error);
    return <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={data.bitcoins}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <Coin
            coin={item}
            onPress={() => navigation.navigate('Detail', { coin: item })}
          />
        )}
        onEndReachedThreshold={0.9}
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data.bitcoins.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                bitcoins: [...prev.bitcoins, ...fetchMoreResult.bitcoins]
              });
            }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616'
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 85
  }
});
