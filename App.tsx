import {StyleSheet, Text, View, Button, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';

const App = () => {
  const [data, setData] = useState([]);
  const [highestPrice, setHighestPrice] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);

  const [coinBase, setCoinBase] = useState(null);



  useEffect(() => {
    fetchBitcoinPrices();
  }, []);

  const fetchBitcoinPrices = async () => {
    try {
      const coinbaseResponse = await fetch(
        'https://api.coinbase.com/v2/prices/spot?currency=USD',
      );
      const coinbaseData = await coinbaseResponse.json();
      // const coinbasePrice = parseFloat(coinbaseData.data.amount);

      const coindeskResponse = await fetch(
        'https://api.coindesk.com/v1/bpi/currentprice.json',
      );
      const coindeskData = await coindeskResponse.json();

      const coincapResponse = await fetch('https://api.coincap.io/v2/assets');
      const coincapData = await coincapResponse.json();
      
      const coinbasePrice = coinbaseData.data.amount;
      const coindeskPrice = coindeskData.bpi.USD.rate;
      const coincapPrice = coincapData.data[0].priceUsd;

      const exchangeData = [
        {exchange: 'coinbase', price: coinbasePrice},
        {exchange: 'coindesk', price: coindeskPrice},
        {exchange: 'coincap', price: coincapPrice},
      ];

      setData(exchangeData);
      console.log("coinbasePrice, coinbasePrice  ---> ",coinbasePrice);
      console.log("coincapPrice, coincapPrice  ---> ", coincapPrice);
      
      const conVar = coinbasePrice > coincapPrice ? "Coin Base" : "CoinDesk";

      setCoinBase(conVar)
      const maximumPrice = Math.max(coinbasePrice, coincapPrice);     
      const minimumPrice = Math.min(coinbasePrice, coincapPrice);      

      setHighestPrice(maximumPrice);
      setLowestPrice(minimumPrice); 

      // console.log("max maximumPrice price ---> ", maximumPrice);
      // console.log("max minimumPrice price ---> ", minimumPrice);
      
    
    } catch (error) {
      console.log("error fetching data -->  ", error)
    }
  };

  const renderItem = ({item}) => (
    
    <View style={styles.row}>
      <Text>{item.exchange}:</Text>
      <Text>{item.price}:</Text>
      <Text>${parseFloat(item.price).toFixed(2)}</Text>
    </View>

  );

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bitcoin Price Tracker</Text>
      {/* {data.map((item)=>(
        <View style={styles.row} key={item.exchange}>
          <Text>{item.exchange}</Text>
          <Text>${parseFloat(item.price).toFixed(2)}</Text>
        </View>
      ))} */}
      <FlatList 
      data={data}
      renderItem={renderItem}
      keyExtractor={(item)=> item.exchange}
      />
      <Text style={styles.highText} >HighestPrice: ${parseFloat(highestPrice).toFixed(2)} {coinBase}</Text>
      <Text style={styles.highLowText}>LowestPrice: ${parseFloat(lowestPrice).toFixed(2)}</Text>
      <Button title='Refresh' onPress={fetchBitcoinPrices}/>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    marginBottom:10
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20

  },
  header:{
    fontSize:24,
    marginBottom:10
  },
  highLowText:{
    fontSize:16,
    fontWeight:'bold',
    backgroundColor: 'green'
  },
  highText:{
    fontSize:16,
    fontWeight:'bold',
    backgroundColor: 'red'

  }
});
