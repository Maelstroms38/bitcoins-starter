import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList
} from 'react-native';
import RoundedButton from '../components/RoundedButton';
import Coin from '../components/Coin';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// styled-components (CSS)

// Queries
const FETCH_FAVORITES = gql`
  query {
    favorites {
      name
      price
      symbol
      imageUrl
      favorite
    }
  }
`;

// Mutations
const ADD_COIN = gql`
  mutation AddCoin($symbol: String!) {
    addCoin(symbol: $symbol) {
      name
      symbol
      price
      imageUrl
      favorite
    }
  }
`;

const REMOVE_COIN = gql`
  mutation RemoveCoin($symbol: String!) {
    removeCoin(symbol: $symbol) {
      name
      symbol
      price
      imageUrl
      favorite
    }
  }
`;

export default function CoinDetail(props) {
  // params available to routes
  const { data, refetch } = useQuery(FETCH_FAVORITES);
  const [addCoin] = useMutation(ADD_COIN);
  const [removeCoin] = useMutation(REMOVE_COIN);
  const { navigation } = props;
  const { params } = props.route;
  const { coin } = params;
  const { symbol, name, price, imageUrl } = coin;

  const isFavorite =
    data &&
    data.favorites &&
    data.favorites.find(coin => coin.symbol == symbol);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
        <Text numberOfLines={1} style={styles.text}>
          {name} - {symbol}
        </Text>
        <RoundedButton
          backgroundColor="skyblue"
          text={isFavorite ? `Remove ${name}` : `Save ${name}`}
          onPress={() => {
            if (isFavorite) {
              removeCoin({
                variables: { symbol: symbol }
              })
                .then(() => refetch())
                .catch(err => console.log(err));
            } else {
              addCoin({
                variables: { symbol: symbol }
              })
                .then(() => refetch())
                .catch(err => console.log(err));
            }
          }}
        />
      </View>

      <View style={styles.statRow}>
        <Text style={styles.text}>Price</Text>
        <Text style={styles.text}>{price}</Text>
      </View>

      <View style={styles.statsContainer}>
        {!!data && !!data.favorites && (
          <FlatList
            data={data.favorites}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => (
              <Coin
                coin={item}
                onPress={() => navigation.navigate('Detail', { coin: item })}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flex: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 22,
    color: '#161616'
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover'
  },
  statsContainer: {
    flex: 62,
    backgroundColor: '#161616'
  },
  statRow: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stat: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  }
});
