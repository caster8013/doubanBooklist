/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, View ,TextInput,Text,Switch,ScrollView,ListView,Image,StyleSheet} from 'react-native';

class Logo extends Component {
  render() {
    let pic = {
      uri: 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png'
    };
    return (
      <Image source={pic} style={[styles.logo, {overflow: 'visible'}]} />
    );
  }
}

class ListViewBasics extends Component {
  listViewRender(book){
      return(
        <View key={book.id} style={styles.container}>
          <Image source={{uri:book.image}} style={[styles.base, {overflow: 'visible'}]}/>
          <View style={styles.rightContainer}>
            <Text>{book.title}</Text>
            <Text>{book.author}</Text>
            <Text>{book.rating.average}</Text>
          </View>
        </View>
      );
  }

  render() {
    return (
      <View style={{paddingTop: 22}}>
        <ListView
          enableEmptySections={true}
          dataSource={this.props.bookData}
          renderRow={this.listViewRender}
        />
      </View>
    );
  }
}

class filterableBookList extends Component {

  constructor(props){
    super(props);
    this.timeoutID = null;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      text:"programming",
      flag:false,
      dataSource: this.ds.cloneWithRows([])
    };
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

  render() {
    return (
      <ScrollView>
        <Logo style={styles.logoView}/>
        <TextInput
          style={{height: 40}}
          value={this.state.text}
          placeholder="Type here some key words!"
          onChangeText={this.textChange.bind(this)}
        />
        <Switch
          value={this.state.flag}
          onValueChange={this.switchChange.bind(this)}
        />
        <ListViewBasics bookData={this.state.dataSource} />
      </ScrollView>
    );
  }
};

var styles = StyleSheet.create({
  logo:{
    height:30,
    width:153,
  },
  base: {
    width: 108,
    height: 137,
  },
  logoView:{
    padding:50,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
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
