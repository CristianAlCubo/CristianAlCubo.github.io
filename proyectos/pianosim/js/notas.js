document.addEventListener("DOMContentLoaded", () => {
  let keys_notes = {
    q: "C.mp3",
    2: "Csharp.mp3",
    w: "D.mp3",
    3: "Dsharp.mp3",
    e: "E.mp3",
    r: "F.mp3",
    5: "Fsharp.mp3",
    t: "G.mp3",
    6: "Gsharp.mp3",
    y: "A.mp3",
    7: "Asharp.mp3",
    u: "B.mp3",
    i: "Chigh.mp3",
  };
  let sounds_key = {};
  let sounds_button = {}

  // Create relation key-sound

  for (let i = 0; i <= 12; i++) {
    let curr_audio = Object.values(keys_notes)[i];
    let curr_key = Object.keys(keys_notes)[i];
    sounds_key[curr_key] = new Audio(`notas/${curr_audio}`);
  }

  // Create relation button-sound

  document.querySelectorAll(".key , .key-black").forEach(async key => {
    let curr_note = key.id;
    sounds_button[curr_note] = new Audio(`notas/${curr_note.replace(/h$/,"high")}.mp3`)
    key.addEventListener("click", ()=>{
      key.classList.toggle("pressed");
      if(!sounds_button[curr_note].paused){
        console.log("is playing")
        sounds_button[curr_note].currentTime = 0;
      }
      sounds_button[curr_note].play();
      setTimeout(()=>{key.classList.toggle("pressed")},100)
    })
  })
  console.log(sounds_button)

  // Manage pressed styles on key press

  document.addEventListener("keydown", (event) => {
    if (sounds_key[event.key] && !event.repeat) {
      let raw_nota = keys_notes[event.key]
        .slice(0, -4)
        .replace("sharp", "sharp")
        .replace("high", "h");
      console.log(raw_nota);
      document.querySelector(`#${raw_nota}`).classList.add("pressed");
      sounds_key[event.key].currentTime = 0;
      sounds_key[event.key].play();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (sounds_key[event.key]) {
      let raw_nota = keys_notes[event.key]
        .slice(0, -4)
        .replace("sharp", "sharp")
        .replace("high", "h");
      document.querySelector(`#${raw_nota}`).classList.remove("pressed");
    }
  });

  // Option's checkbox behaviors

  document.querySelector("#key_checkbox").addEventListener("click", () => {
    document.querySelectorAll(".key_keyboard-key").forEach((key) => {
      key.classList.toggle("d-none");
    });
  });

  document.querySelector("#note_checkbox").addEventListener("click", () => {
    document.querySelectorAll(".key_note").forEach((key) => {
      console.log(key);
      key.classList.toggle("d-none");
    });
  });


});
