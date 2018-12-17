import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Button
} from "react-native";

import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';
import codePush from 'react-native-code-push';

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class TodoApp extends Component {

    sendEvent(){
        Analytics.trackEvent('My Custom Event', {
            TimeStamp: new Date().getTime()
        });
    }

    nativeCrash(){
        Crashes.generateTestCrash();
    }

    jsCrash(){
        this.func1();
    }

    func1(){ this.func2() }
    func2(){ this.func3() }
    func3(){ this.func4() }
    func4(){ this.func5() }

    func5(){
        throw new Error('My uncaught Javascript exception.');
    }

    constructor(props){
        super(props);
        this.state = {
            logs: []
        };
    }

    codePushSync(){
        this.setState({logs: ['Sync has started.']});
        codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        }, (status) => {
            for (var key in codePush.SyncStatus) {
                if(status === codePush.SyncStatus[key]) {
                    this.setState(prevState => ({logs: [...prevState.logs, key.replace(/_/g, ' ')]}));
                    break;
                }
            }
        });
    } 

    // codePushSync(){
    //     this.setState({logs: ['Sync has started.']});
    //     CodePush.sync();
    // } 

    

    render() {
        return (
            <View style={styles.container}>
                <Text>Todo Code Push</Text>
                <Text>Updated!</Text>
                <Button title='Send Event' onPress={() => this.sendEvent()}/>
                <Button title='Native Crash' onPress={() => this.nativeCrash()}/>
                <Button title='JS Crash' onPress={() => this.jsCrash()} />
                <Button title='Code Push' onPress={() => this.codePushSync()} />
                {this.state.logs.map((log, i) => <Text key={i}>{log}</Text>)}

            </View>
        );
    }
}

TodoApp = codePush(codePushOptions)(TodoApp);

export default TodoApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});