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
         TouchableNativeFeedback,ActivityIndicator,
       } from 'react-native';

var cache = {
  totalForQuery:{},
  dataForQuery:{},
};
var loading = {};

class Logo extends Component {
  render() {
    let pic = {
      uri: 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png'
    };
    return (<Image source={pic} style={[styles.logo, {overflow: 'visible'}]}/>);
  }
}

class BookScreen extends Component{
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

class BookCell extends Component{
  render(){
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
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
      </View>
    );
  }
}

class MainPage extends Component {

  constructor(props){
    super(props);
    this.timeoutID = null;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isLoading:false,
      isLoadingTail:false,
      text:"life",
      flag:false,
      dataSource: this.ds.cloneWithRows([])
    };
  }

  _getUrlForQuery(tag,start){
      return !start ? "https://api.douban.com/v2/book/search?q="+tag :
        "https://api.douban.com/v2/book/search?q="+tag+"&start="+start;
  }

  componentDidMount(){
    console.log("componentDidMount");
    this.textChange("life");
  }

  textChange(input){
    let key = input.trim().toLowerCase();
    this.timeoutID && clearTimeout(this.timeoutID);
    if(key){
      this.setState({text:key});
      console.log("mark");
      this.timeoutID = setTimeout(() => this.getData(key), 500);
      console.log("moo");
    } else {
      this.setState({text:"",dataSource: this.ds.cloneWithRows([])});
    }
  }

  switchChange(switchButton){
    this.setState({flag:switchButton});
    this.getData(this.state.text);
  }

  getData(keyWord){
    if(keyWord){ //There are keywords in TextInput.

      if(!cache.dataForQuery[keyWord]){ //New keywords.

        console.log(this._getUrlForQuery(keyWord));
        this.setState({isLoading:true});
        fetch(this._getUrlForQuery(keyWord))
        .then((response) => response.json())
        .then((data)=>{
          console.log(data);
          cache.totalForQuery[keyWord] = data.total;
          cache.dataForQuery[keyWord] = data.books;
          console.log(data.books);
          let _books = data.books.filter(
            (book)=>{ if(!this.state.flag || book.rating.average >= 8.0) return true; else return false;}
          );
          if (this.state.text !== keyWord) {
            return;// do not update state if the query is stale(过时的)
          }
          this.setState({dataSource:this.ds.cloneWithRows(_books),isLoading:false});
        })
        .catch((error) => {
          this.setState({dataSource:this.ds.cloneWithRows([]),isLoading:false})
          console.log("get data function error: "+error);
        });

      } else {  //keywords have been queried.query data for keywords are cached.
        let _books = cache.dataForQuery[keyWord].filter(
          (book)=>{ if(!this.state.flag || book.rating.average >= 8.0) return true; else return false;}
        );
        this.setState({dataSource:this.ds.cloneWithRows(_books)});
      }

    } else {  //The TextInput is blank
      this.setState({dataSource:this.ds.cloneWithRows([])});
    }

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

  listviewEndReached(){
    console.log("listviewEndReached");
    let keyWord = this.state.text;
    if(cache.dataForQuery[keyWord]){
      this.setState({isLoadingTail:true});
      fetch(this._getUrlForQuery(keyWord,cache.dataForQuery[keyWord].length+1))
      .then((response) => response.json())
      .then((data)=>{
        let dataForMovies = cache.dataForQuery[keyWord].slice();
        if(!data.books){
          this.setState(isLoadingTail:false);
          return;
        } else{
          for(let i in data.books){
            dataForMovies.push(data.books[i]);
          }
        }
        cache.dataForQuery[keyWord] = dataForMovies;
        let _books = dataForMovies.filter(
          (book)=>{ if(!this.state.flag || book.rating.average >= 8.0) return true; else return false;}
        );
        if (this.state.text !== keyWord) { return; } // do not update state if the query is stale(过时的)
        this.setState({dataSource:this.ds.cloneWithRows(_books),isLoading:false});
      })
      .catch((error) => {
        this.setState({isLoading:false})
        console.log("get data function error: "+error);
      });
    }
  }

  renderFooter(){
    console.log("renderFooter");
    if (!this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <ActivityIndicator style={styles.scrollSpinner} />;
  }

  render() {
    return (
      <ScrollView style={[styles.MainContainer,{padding:5}]}>
        <Logo style={styles.MainContainer}/>
        <View style={styles.searchBar}>
        <TextInput
          style={styles.searchBarInput}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.text}
          placeholder="Type here some key words!"
          onChangeText={this.textChange.bind(this)}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        />
        <ActivityIndicator animating={this.state.isLoading} style={styles.spinner}/>
        </View>
        <View style={styles.switchWrapper}>
          <Switch
            value={this.state.flag}
            onValueChange={this.switchChange.bind(this)}
          />
          <Text style={{fontSize:20,padding:8}}>8星以上</Text>
        </View>
        <View style={{paddingTop: 5}}>
          <ListView
            ref="listview"
            enableEmptySections={true}
            renderSeparator={(sectionID,rowID,adjacentRowHighlighted)=>
              <View key={'sep_'+sectionID+'_'+rowID} style={styles.rowSeparator}></View>
              }
            renderFooter={this.renderFooter.bind(this)}
            onEndReached={this.listviewEndReached.bind(this)}
            dataSource={this.state.dataSource}
            renderRow={(book)=><BookCell key={book.id} onSelect={()=>this.selectBook(book)} book={book}/>
            }
          />
        </View>
      </ScrollView>
    );
  }
}

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
    padding:5,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  contentContainer:{
    padding: 10,
  },
  mainSection: {
    flexDirection: 'row',
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
  switchWrapper:{
    flexDirection:'row',
    //marginBottom:15,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  searchBar: {
    //marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});

 // 注意，这里用引号括起来的'HelloWorldApp'必须和你init创建的项目名一致
AppRegistry.registerComponent('doubanBooklist', () => filterableBookList);
