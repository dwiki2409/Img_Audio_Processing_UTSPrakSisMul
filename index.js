// ============================================

const uploadBox = document.querySelector('.upload-box'),
   previewImage = uploadBox.querySelector('img'),
   fileInput = uploadBox.querySelector('input'),
   widthInput = document.querySelector('.width input'),
   heightInput = document.querySelector('.height input'),
   ratioInput = document.querySelector('.ratio input'),
   qualityInput = document.querySelector('.quality input'),
   downloadBtn = document.querySelector('.download-btn')

let ogImageRatio;

const loadFile = (e) => {
   const file = e.target.files[0];
   if (!file) return
   previewImage.src = URL.createObjectURL(file)
   previewImage.addEventListener('load', () => {
      widthInput.value = previewImage.naturalWidth;
      heightInput.value = previewImage.naturalHeight;
      ogImageRatio = previewImage.naturalWidth / previewImage.naturalHeight;
      document.querySelector('.container').classList.add('active')
   })
}

widthInput.addEventListener('keyup', () => {
   const height = ratioInput.checked ? widthInput.value / ogImageRatio : heightInput.value;
   heightInput.value = Math.floor(height);
})

heightInput.addEventListener('keyup', () => {
   const width = ratioInput.checked ? heightInput.value * ogImageRatio : widthInput.value;
   widthInput.value = Math.floor(width);
})

const resizeDownload = () => {
   const canvas = document.createElement('canvas')
   const a = document.createElement('a')
   const ctx = canvas.getContext('2d')
   const imgQuality = qualityInput.checked ? 0.7 : 1.0;

   canvas.width = widthInput.value;
   canvas.height = heightInput.value;
   ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height)

   a.href = canvas.toDataURL("image/", imgQuality)
   a.download = new Date().getTime()
   a.click()
}

downloadBtn.addEventListener('click', resizeDownload)
fileInput.addEventListener('change', loadFile)
uploadBox.addEventListener('click', () => fileInput.click())

// ==========================================================

function compressAudio() {
   var fileInput = document.getElementById('input-file')
   var file = fileInput.files[0];

   var reader = new FileReader()

   reader.onload = function (e) {

      var audioContext = new (window.AudioContext || window.webkitAudioContext)();

      audioContext.decodeAudioData(e.target.result, function (buffer) {

         var source = audioContext.createBufferSource();
         source.buffer = buffer;

         var scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
         var compressor = audioContext.createDynamicsCompressor();

         compressor.threshold.value = -30;
         compressor.knee.value = 10;
         compressor.ratio.value = 12;
         compressor.attack.value = 0;
         compressor.release.value = 0.25;

         source.connect(scriptNode);
         scriptNode.connect(compressor);
         compressor.connect(audioContext.destination);

         var compressedBuffer = audioContext.createBuffer(1, buffer.length, audioContext.sampleRate)
         scriptNode.onaudioprocess = function (event) {
            var inputBuffer = event.inputBuffer;
            var outputBuffer = event.outputBuffer;
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
               var inputData = inputBuffer.getChannelData(channel);
               var outputData = outputBuffer.getChannelData(channel);
               for (var sample = 0; sample < inputBuffer.length; sample++) {
                  outputData[sample] = inputData[sample];
               }
            }
         };

         source.start()
         setTimeout(function () {
            source.stop()
            audioContext.close()

            var offlineContext = new OfflineAudioContext(1, compressedBuffer.length, audioContext.sampleRate)
            var offlineSource = offlineContext.createBufferSource();
            offlineSource.buffer = compressedBuffer;

            offlineSource.connect(offlineContext.destination);
            offlineSource.start();
            offlineContext.startRendering().then(function (renderedBuffer) {
               var compressedAudio = new File([renderedBuffer], file.name, { type: file.type });
               var downloadLink = document.getElementById('downloadLink')
               downloadLink.href = URL.createObjectURL(compressedAudio);
               downloadLink.download = 'kompresi_' + file.name;
            });

            var previewAudio = document.getElementById('previewAudio');
            previewAudio.src = URL.createObjectURL(compressedAudio);
         }, buffer.duration * 1000);
      })
   }
   reader.readAsArrayBuffer(file);
}

