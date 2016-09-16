import React,{Component} from 'react';
import {ScrollView,View,Image,Text,StyleSheet} from 'react-native'

export default class BookScreen extends Component{
  render(){
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          <Image source={{uri:this.props.book.image}} style={styles.base}/>
          <View style={styles.contentContainer}>
            <Text>Title:{this.props.book.title}</Text>
            <Text>Subtitle:{this.props.book.title}</Text>
            <Text>Author:{this.props.book.author}</Text>
            <Text>Publisher:{this.props.book.publisher}</Text>
            <Text>Price:{this.props.book.price}</Text>
          </View>
        </View>
        <View style={styles.separator}/>
        <View>
          <Text style={styles.mpaaText}>{this.props.book.summary}</Text>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  contentContainer:{
    padding: 10,
  },
  mainSection: {
    flexDirection: 'row',
  },
  base: {
    width: 108,
    height: 137,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
    fontWeight: '500',
  },
});
