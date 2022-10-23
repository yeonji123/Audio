import React from 'react';
import vmsg  from 'vmsg';

const recorder = new vmsg.Recorder({
    wasmURL: "http://unpkg.com/vmsg@0.3.0/vmsg.wasm"
})

class Sample extends React.Component{
    state={
        isLoading:false,
        isRecording : false,
        recordings:[]
    }
    record = async () => {
        this.setState({ isLoading: true })

        if (this.state.isRecording) {
            const blob = await recorder.stopRecording();
            this.setState({
                isLoading: false,
                isRecording: false,
                recordings: this.state.recordings.concat(URL.createObjectURL(blob))
            })
        } else {
            try {
                await recorder.initAudio();
                await recorder.initWorker()
                recorder.startRecording()
                this.setState({ isLoading: false, isRecording: true })
            } catch (e) {
                console.error(e);
                this.setState({ isLoading: false })
            }
        }
    }
   

    render(){
        const {isLoading, isRecording, recordings} = this.state;
        console.log(recordings);
        
        return (
            <React.Fragment>
                <form onSubmit={this.record} encType="multipart/form-data">
                    <button disabled={isLoading} onClick={this.record}>
                        {isRecording ? "Stop" : "Record"}
                    </button>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {recordings.map(url => (
                            <li key={url} >
                                <audio src={url} controls></audio>
                            </li>
                        ))}
                    </ul>
                </form>
            </React.Fragment>
        )
    }
}

export default Sample;