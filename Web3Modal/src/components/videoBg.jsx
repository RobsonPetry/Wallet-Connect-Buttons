const VideoBg = () => {
    const v = "https://move-app.com/video/presalebg.webm";
    return (
      <div className="main">
        <video src={v} autoPlay loop muted></video>
      </div>
    );
  };
  
  export default VideoBg;
  