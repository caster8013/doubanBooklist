/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, View, ScrollView,
         TextInput, Text, Switch,
         NavigatorIOS, ListView, Image,
         StyleSheet, Platform, TouchableHighlight,
         TouchableNativeFeedback
       } from 'react-native';

class Logo extends Component {
  render() {
    let pic = {
      uri: 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png'
    };
    return (<Image source={pic} style={[styles.logo, {overflow: 'visible'}]}/>);
  }
}

class BookScreen extends Component{
  //let author = this.props.book.author.toString();
  render(){
    return (
      <ScrollView>
        <View>
          <Image source={{uri:this.props.book.image}}/>
          <Text>Title:{this.props.book.title}</Text>
          <Text>Subtitle:{this.props.book.title}</Text>
          <Text>Author:{this.props.book.author}</Text>
          <Text>Publisher:{this.props.book.publisher}</Text>
          <Text>Price:{this.props.book.price}</Text>
        </View>
        <View>{this.props.book.summary}</View>
      </ScrollView>
    );
  }
}

class BookCell extends Component{
  render(){
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <TouchableElement onPress={this.props.onSelect}>
        <View style={styles.container}>
          <Image source={{uri:this.props.book.image}} style={[styles.base, {overflow: 'visible'}]}/>
          <View style={styles.rightContainer}>
            <Text>{this.props.book.title}</Text>
            <Text>{this.props.book.author}</Text>
            <Text>{this.props.book.rating.average}</Text>
          </View>
        </View>
      </TouchableElement>
    );
  }
}

class MainPage extends Component {

  constructor(props){
    super(props);
    this.timeoutID = null;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      text:"programming",
      flag:false,
      dataSource: this.ds.cloneWithRows([])
    };
    //this.selectBook = this.selectBook.bind(this);
  }

  componentDidMount(){
    this.getInternetData("programming");
  }

  textChange(input){
    let key = input.trim().toLowerCase();
    if(key){
      this.setState({text:key});
      this.timeoutID && clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => this.getInternetData(key), 500);
    } else {
      this.timeoutID && clearTimeout(this.timeoutID);
      this.setState({text:"",dataSource: this.ds.cloneWithRows([])});
    }
  }

  switchChange(switchButton){
    console.log(switchButton);
    this.setState({flag:switchButton});
    this.getInternetData(this.state.text);
  }

  getInternetData(keyWord){
    fetch("https://api.douban.com/v2/book/search?q="+keyWord)
    .then((response) => response.json())
    .then((data)=>{
      console.log(data);
      let _books = data.books.filter(
        (book)=>{ if(!this.state.flag || book.rating.average >= 8.0) return true; else return false;}
      );
      this.setState({dataSource:this.ds.cloneWithRows(_books)});
    })
    .catch((error) => {
      console.log("getInternetData function error: "+error);
    });
  }

  selectBook(book){
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: book.title,
        component: BookScreen,
        passProps: {book},
      });
    }
  }

  render() {
    return (
      <ScrollView style={{flex:1}}>
        <Logo style={{flex:1}}/>
        <TextInput
          style={{flex:1,height:40}}
          value={this.state.text}
          placeholder="Type here some key words!"
          onChangeText={this.textChange.bind(this)}
        />
        <Switch
          //style={{flex: 1, backgroundColor: 'powderblue'}}
          value={this.state.flag}
          onValueChange={this.switchChange.bind(this)}
        />
        <View style={{paddingTop: 22}}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={
              (book)=>
                <BookCell
                  key={book.id}
                  onSelect={()=>this.selectBook(book)}
                  book={book}
                />
            }
          />
        </View>
      </ScrollView>
    );
  }
};

class filterableBookList extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.MainContainer}
        initialRoute={{
          title: 'Main page',
          component: MainPage,
        }}
      />
    );
  }
}

var styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  logo:{
    width:153,
    height:30,
  },
  base: {
    width: 108,
    height: 137,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
});

 // 注意，这里用引号括起来的'HelloWorldApp'必须和你init创建的项目名一致
AppRegistry.registerComponent('doubanBooklist', () => filterableBookList);
