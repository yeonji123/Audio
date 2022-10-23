import React, { Component } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios from 'axios';
const result = true;

function time() {
    const timer = setInterval(count, 1000);
    function count() {
        count++;
        if (count > 60) {
            result = false;
            clearInterval(timer);
        }
    }
}


class Sample2 extends Component {



    constructor(props) {
        super(props)

        this.state = {
            recordState: null
        }
    }

    start = () => {
        time();
        this.setState({
            recordState: RecordState.START
        })
    }

    stop = () => {
        this.setState({
            recordState: RecordState.STOP
        })

    }

    pause = () => {
        this.setState({
            recordState: RecordState.PAUSE
        })
    }

    //audioData contains blob and blobUrl
    onStop = (audioData) => {
        console.log('audioData', audioData)

        axios.post("http://Udangtangtangapp-env.eba-xaipu9ej.ap-northeast-2.elasticbeanstalk.com/yTest", {
            url: audioData.blob
        })
            .then(function (check) {//서버에서 주는 리턴값???
                console.log(check);//data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const { recordState } = this.state

        return (
            <div>
                <AudioReactRecorder state={recordState} onStop={this.onStop} ></AudioReactRecorder>
                <button onClick={this.start}>시작</button>
                <button onClick={this.stop}>저장</button>
                <button onClick={this.pause}>일시중지</button>


            </div>
        )
    }
}

export default Sample2;