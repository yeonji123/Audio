import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";


const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [bloburl, setbloburl] = useState();
  const [file, setFile] = useState();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.post("http://192.168.2.82:5000/yTest",
  //         {
  //           id: "ㅇㅇㅇㅇ"
  //         });
  //       console.log(res)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })();
  // }, [])


  const onRecAudio = () => {
    console.log("녹음 시작")
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    //const analyser = audioCtx.AudioWorkletNode(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      console.log("마이크 사용 가능");
      const options = {
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus'
      };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        // 1분(60초) 지나면 자동으로 음성 저장 및 녹음 중지
        if (e.playbackTime > 59) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          // 메서드가 호출 된 노드 연결 해제
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {

            setAudioUrl(e.data);
            setOnRec(true);
          };
          console.log("dddddd");
        } else {
          setOnRec(false);
        }
      };
    });
  };

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = () => {
    console.log("녹음 중지")
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      console.log(e);
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });


    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();



  };

  const onSubmitAudioFile = useCallback(() => {
    console.log(audioUrl);
    if (audioUrl) {
      const url = URL.createObjectURL(audioUrl);
      setbloburl(url);
      console.log(url); // 출력된 링크에서 녹음된 오디오 확인 가능 (blob:https://~~)

      //다운로드
      // let aElm = document.createElement('a');
      // aElm.href = URL.createObjectURL(audioUrl);
      // aElm.download = 'audio.webm';
      // aElm.click();

      //upload file
      let formdata = new FormData();
      formdata.append("fname", "audio.webm");
      formdata.append("data", URL.createObjectURL(audioUrl));

      // axios.post("http://192.168.2.82:5000/yTest", {
      //   file: url
      // })
      //   .then(function (check) { //서버에서 주는 리턴값???
      //     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    }
    // File 생성자를 사용해 파일로 변환
    //var file = new File([audioUrl], "name");
    //console.log(file);
    const sound = new File([audioUrl], "recorder", { lastModified: new Date().getTime(), type: "audio" });
    console.log("파일정보", sound);
    setFile(sound);



    let formData = new FormData();
    formData.append("file", sound);

    axios.post('http://192.168.2.82:5000/yTest', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then(function (check) { //서버에서 주는 리턴값???
        console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
      })
      .catch(function (error) {
        console.log(error);
      });

    //서버에 전송
    // axios.post("http://192.168.2.82:5000/yTest", {
    //   file: bloburl
    // })
    //   .then(function (check) { //서버에서 주는 리턴값???
    //     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });


  }, [audioUrl]);


  const sendserver = () => {
    // console.log(file)
    // let formData = new FormData();
    // formData.append("file", file);

    // axios.post('http://192.168.2.82:5000/yTest', formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   }
    // })
    //   .then(function (check) { //서버에서 주는 리턴값???
    //     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    // onSubmitAudioFile();

    //blob으로 보내기
    // axios.post("http://192.168.2.82:5000/yTest", {
    //   blob : "bloburl"
    // })
    //   .then(function (check) { //서버에서 주는 리턴값???
    //     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });



    // File 생성자를 사용해 파일로 변환
    //var file = new File([audioUrl], "name");
    //console.log(file);
    // const sound = new File([audioUrl], "recorder", { lastModified: new Date().getTime(), type: "audio" });
    // console.log("파일정보", sound);



    // //서버에 전송
    // axios.post("http://192.168.2.82:5000/yTest", {
    //   id: "sound"
    // })
    //   .then(function (check) { //서버에서 주는 리턴값???
    //     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }



  return (
    <>
      {/* 시작, 중지 왔다갔다 */}

      <button type="button" id="recode" onClick={onRecAudio}>녹음 시작</button>
      <button type="button" id="recode" onClick={offRecAudio}>일지 정지</button>
      <button onClick={onSubmitAudioFile}>결과 확인</button>
      <button onClick={sendserver}>하아아이이이</button>

      {/* <form encType="multipart/form-data"onSubmit={sendserver}><button>저장</button>저장<audio src={file}></audio></form> */}
      <h3>dddddddddddddddddddd</h3>

    </>
  );

}

export default AudioRecord;