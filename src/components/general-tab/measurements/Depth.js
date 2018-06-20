import React, {Component} from 'react';
import './Depth.css';

const density = 1025;

function calculateDepth(pressure, offset) {
    console.log(pressure);
    if(pressure === null) {
        return 'Unknown'
    }
    return ((pressure - offset) / (density * 9.81)).toFixed(2) + ' m';
}

class Depth extends Component {
    constructor(props) {
        super(props);
        this.state = {offset: 0};
    }

    render() {
        const {pressure} = this.props;
        const {offset} = this.state;
        const depth = calculateDepth(pressure, offset);

        return (
            <div className='depth'>Depth: {depth}</div>
        );
    }
}

export default Depth;