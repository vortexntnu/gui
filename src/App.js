import React, {Component} from 'react';
import './App.css';
import ROSLIB from 'roslib';
import RosError from './components/RosError';
import Connecting from './components/Connecting';
import {Tab} from 'semantic-ui-react';
import GeneralTab from './components/generalTab/GeneralTab';
import ObsTab from './components/obsTab/ObsTab';
import AircraftIdTab from './components/aircraftIdTab/AircraftIdTab';
import SearchZoneTab from './components/search-zone-tab/SearchZoneTab';

const panes = [
    {menuItem: 'General', render: () => <Tab.Pane><GeneralTab/></Tab.Pane>},
    {menuItem: 'OBS', render: () => <Tab.Pane><ObsTab/></Tab.Pane>},
    {menuItem: 'Aircraft identification', render: () => <Tab.Pane><AircraftIdTab/></Tab.Pane>},
    {menuItem: 'Search zone', render: () => <Tab.Pane><SearchZoneTab/></Tab.Pane>},
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedToRosbridge: false,
            connectedToRov: true,
        };
    }

    componentDidMount() {
        this.connectToRosbridge();
    }

    connectToRosbridge = () => {
        const ros = new ROSLIB.Ros({url: 'ws://localhost:9090'});

        ros.on('connection', () => {
            clearTimeout(this.reconnectionTimer);
            console.log('Connected to websocket server.');
            this.setState({connectedToRosbridge: true});
        });

        ros.on('close', () => {
            console.log('Connection to websocket server closed.');
            this.setState({connectedToRosbridge: false});
            this.reconnectionTimer = setTimeout(() => this.connectToRosbridge(), 500);
        });

        const isRovAliveTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/is_alive',
            messageType: 'std_msgs/Empty'
        });
        this.refreshAliveTimeout();
        isRovAliveTopic.subscribe(this.stillAlive);
    };

    refreshAliveTimeout = () => {
        clearTimeout(this.aliveTimeout);
        this.aliveTimeout = setTimeout(this.die, 1000);
    };

    stillAlive = () => {
        const connectedToRov = this.state.connectedToRov;

        this.refreshAliveTimeout();
        if(!connectedToRov) {
            this.setState({isConnectedToRov: true});
        }
    };

    die = () => {
        const connectedToRov = this.state.connectedToRov;

        if(connectedToRov) {
            this.setState({connectedToRov: false});
        }
    };

    gui = () => {
        const {connectedToRosbridge, connectedToRov} = this.state;

        if(!connectedToRosbridge) {
            return <Connecting/>
        } else if(!connectedToRov) {
            return <RosError/>
        } else {
            return <Tab id="Tab" panes={panes}/>
        }

    };

    render() {
        return (
            <div id="App">
                {this.gui()}
            </div>
        );
    }
}

export default App;
