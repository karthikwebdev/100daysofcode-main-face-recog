
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)
async function start() {
Webcam.set({
    width:320,
    height:240,
    image_format: 'png',
    jpeg_quality: 100
 });
 Webcam.attach( '#my_camera' );
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  document.body.append('Loaded')
 setInterval(() =>  {
        Webcam.snap((data_uri)=> {
            fetch(data_uri)
            .then(res => res.blob())
            .then(async (blob) => {
              const file = new File([blob], 'snap.png', blob)
              image = await faceapi.bufferToImage(file)
              const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
              const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor))
              results.forEach((result, i) => {
                console.log(result.toString());
              })
            })
         });
 }, 1000);
}


function loadLabeledImages() {
    const labels = ['karthik','rohith','dinkar']
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 2; i++) {
            let img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )}
