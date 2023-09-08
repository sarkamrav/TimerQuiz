let rules =  [
    "You must use a functioning webcam and microphone",
    "No cell phones or other secondary devices in the room or test area",
    "Your desk/table must be clear or any materials except your test-taking device",
    "No one else can be in the room with you",
    "The testing room must be well-lit and you must be clearly visible",
    "No use of additional applications or internet",
    "Do not leave the camera"

];




let instructions = document.getElementById('instruction');
let instructionsWrapper = document.createElement("ul");
rules.forEach((data)=>{
   let li =  document.createElement("li");
   li.textContent = data;
   instructionsWrapper.appendChild(li);
})

instructions.appendChild(instructionsWrapper);