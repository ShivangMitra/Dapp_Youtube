import React, { useState } from 'react';

function Main({ captureFile, uploadVideo, changeVideo, latest, videos }) {

  const [videotitle, setVideotitle] = useState('')

  return (
    <div className="container-fluid text-monospace">
      <br></br>
      &nbsp;
      <br></br>
        <div className="row">
          <div className="col-md-10">
            <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '768px'}}>
              <video
                src={`https://ipfs.infura.io/ipfs/${latest.currentHash}`}
                controls
              />
            </div>
            <h3><b><i>{latest.currentTitle}</i></b></h3>
          </div>
          <div className="col-md-2 overflow-auto text-center" style={{ maxHeight: '768px', minWidth: '175px' }}>
            <h5><b>Share Video</b></h5>
            <form onSubmit={(e) => {
              e.preventDefault()
              uploadVideo(videotitle)
            }} >
              &nbsp;
              <input type='file' accept='.mp4, .mkv, .ogg, .wmv' onChange={captureFile} style={{ width: '250px' }} />
              <div className="form-group mr-sm-2">
                <input 
                  id='videoTitle'
                  type='text'
                  className='form-control-sm'
                  placeholder='Title...'
                  onChange={(e) => setVideotitle(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='btn btn-danger btn-block btn-sm' >Upload!</button>
              &nbsp;
            </form>
            {
              videos.map((video, key) => (
                <div className='card mb-4 text-center bg-secondary mx-auto' style={{ width: '175px'}} key={key}>
                  <div className="card-title bg-dark">
                    <small className="text-white"><b>{video.title}</b></small>
                  </div>
                    <div>
                      <p onClick={() => changeVideo(video.hashVal, video.title)} style={{ cursor: 'pointer' }} >
                        <video
                          src={`https://ipfs.infura.io/ipfs/${video.hashVal}`}
                          style={{ width: '150px' }}
                        />
                      </p>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
  )
}

export default Main