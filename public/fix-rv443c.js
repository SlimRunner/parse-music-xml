(function () {
  "use strict";
  const splicer = (index, value) => {
    const {val: duration} = value;
    return csvArray.splice(index - 1, 0, {
      isPitch: false,
      duration: duration,
    });
  };
  const alterNote = (note, accoff) => {
    const [, letter, accidental, octave] = note.match(/(\w)([\#b]?)(\d)/) ?? [, "C", "", "4"];
    const pitch = {
      C: -9,
      D: -7,
      E: -5,
      F: -4,
      G: -2,
      A: 0,
      B: 2,
    }[letter] +
    (Number(octave) - 4) * 12 +
    { "#": 1, b: -1, "": 0 }[accidental];
    const newPitch = pitch + 12 * 4 + accoff;
    const newNote = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'][newPitch % 12];
    return `${newNote}${Math.floor((newPitch + 9) / 12)}`;
  };
  const triller = (index, value) => {
    const pitch = csvArray[index - 1].pitch;
    const {val, count, duration} = value;
    const newNotes = [];
    const pMain = pitch;
    const pCounter = alterNote(pitch, val);
    for (let i = 0; i < count; ++i) {
      newNotes.push({
        isPitch: true,
        pitch: ((i % 2) == 0 ? pMain : pCounter),
        duration: duration
      });
    }
    return csvArray.splice(index - 1, 1, ...newNotes);;
  };

  let splices = [
    {989: {type: "insert", val: "1/16"}},
    {907: {type: "insert", val: "1/16"}},
    {804: {type: "insert", val: "1/16"}},
    {725: {type: "insert", val: "1/16"}},
    {718: {type: "insert", val: "1/16"}},
    {711: {type: "insert", val: "1/16"}},
    {599: {type: "insert", val: "1/16"}},
    {540: {type: "insert", val: "1/8"}},
    {505: {type: "insert", val: "1/8"}},
    {501: {type: "insert", val: "1/16"}},
    {497: {type: "insert", val: "1/16"}},
    {493: {type: "insert", val: "1/16"}},
    {489: {type: "insert", val: "1/16"}},
    {285: {type: "insert", val: "1/8"}},
    {272: {type: "insert", val: "1/16"}},
    {243: {type: "insert", val: "1/8"}},
    {239: {type: "insert", val: "1/16"}},
    {41: {type: "insert", val: "1/16"}},
    {983: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {980: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {977: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {974: {type: "trill", val: 1, count: 6, duration: "1/24"}},
    {971: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {969: {type: "trill", val: 2, count: 2, duration: "1/32"}},

    {930: {type: "trill", val: 1, count: 6, duration: "1/24"}},

    {705: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {702: {type: "trill", val: 1, count: 6, duration: "1/24"}},
    {699: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {696: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {693: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {670: {type: "trill", val: 1, count: 5, duration: "1/20"}},

    {504: {type: "trill", val: 2, count: 5, duration: "1/20"}},
    {500: {type: "trill", val: 1, count: 5, duration: "1/20"}},
    {496: {type: "trill", val: 2, count: 5, duration: "1/20"}},
    {492: {type: "trill", val: 2, count: 5, duration: "1/20"}},

    {454: {type: "trill", val: 1, count: 6, duration: "1/24"}},
    // {454: {type: "trill", val: 1, count: 7, duration: "1/28"}},
    // if you use the one above the base interval will be 3360
    // otherwise it's still 480
    
    {233: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {230: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {227: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {224: {type: "trill", val: 1, count: 6, duration: "1/24"}},
    {221: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {198: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {193: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {188: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {151: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {140: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {89: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {86: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {83: {type: "trill", val: 2, count: 6, duration: "1/24"}},

    {35: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {32: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {29: {type: "trill", val: 2, count: 6, duration: "1/24"}},
    {26: {type: "trill", val: 1, count: 6, duration: "1/24"}},
    {23: {type: "trill", val: 2, count: 6, duration: "1/24"}},
  ];

  splices.sort((a,b) => Number(Object.keys(b)[0]) - Number(Object.keys(a)[0]));
  
  for (const pairs of splices) {
    let [key, value] = Object.entries(pairs)[0];
    console.log(key, value);
    switch (value.type) {
      case "insert":
        splicer(key, value);
        break;
    
      case "trill":
        triller(key, value);
        break;
    
      default:
        break;
    }
  }

  csvArray.forEach((e, i, a) => {
    if (e.isPitch) {
    } else {
      console.log(a[i - 1], a[i + 1]);
    }
  });
})();
