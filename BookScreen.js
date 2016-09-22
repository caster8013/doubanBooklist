import React,{Component} from 'react';
import {ScrollView,View,Image,Text,StyleSheet,TouchableHighlight,TouchableNativeFeedback,Platform} from 'react-native';
import MainPage from "./MainPage";

export default class BookScreen extends Component{
  constructor(props){
    super(props);
    this.navigatorTo = this.navigatorTo.bind(this);
  }

  navigatorTo(tag){
    this.props.navigator.push({
      title: "Main page",
      tag: tag,
    });
  }

  render(){
    let TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    let tagsList = this.props.book.tags.map(tag=>{
      return (
        <TouchableElement underlayColor='transparent' key={tag.name} onPress={()=>this.navigatorTo(tag.name)}>
          <Text style={styles.tag}>{tag.name}</Text>
        </TouchableElement>
      );
    });
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
        <View style={styles.tagsContainer}>{tagsList}</View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  contentContainer:{
    padding: 10,
    paddingTop:50,
  },
  tag:{
    marginVertical:5,
    color:'blue',
    borderWidth:1,
    borderColor:'#cccccc',
    padding:5,
    marginRight:10
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
  tagsContainer:{
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    height:40
  }
});
