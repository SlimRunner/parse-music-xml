(function () {
  "use strict";
  window.addEventListener("load", (wevt) => {
    let runButton = document.getElementById("runButton");
    runButton.addEventListener("change", (evt) => {
      processData(evt.target.files[0]);
    });
  });

  // Transform loaded data
  async function processData(file) {
    let xmlData = await loadFile(file);
    let parser = new DOMParser();
    let xmlNode = parser.parseFromString(xmlData, "text/xml");
    // let pathNodes = Array.from(xmlNode.querySelectorAll('path'));
    // let pathData = pathNodes.map(e => e.getAttribute('d'));

    const partCollection = xmlNode.children[0].children;
    const parts = [];
    for (const props of partCollection) {
      console.log(props.tagName);
      if (props.tagName.toLowerCase() === "part") {
        parts.push(props);
      }
    }
    let song = parts.map((part) => {
      const measures = Array.from(part.children).flatMap((measure) => {
        const notes = [];
        for (let props of measure.children) {
          if (props.tagName.toLowerCase() === "note") {
            notes.push(props);
          }
        }
        return notes.map((note) => {
          const getNodeProp = (e, t) => {
            const q = e?.getElementsByTagName(t) ?? null;
            if (!q) return null;
            return q[0];
          };
          const isRest = getNodeProp(note, "rest") != null;
          const mustSquash =
            (getNodeProp(note, "tied")?.getAttribute("type") ?? null) ===
            "stop";
          let pitch = getNodeProp(note, "pitch");
          if (pitch) {
            let noteValue = 0;
            for (const props of pitch.children) {
              switch (props.tagName) {
                case "octave":
                  noteValue +=
                    12 * Number(props.textContent.replaceAll(/\s/g, "")) - 48;
                  break;

                case "step":
                  noteValue += {
                    C: -9,
                    D: -7,
                    E: -5,
                    F: -4,
                    G: -2,
                    A: 0,
                    B: 2,
                  }[props.textContent.replaceAll(/\s/g, "")];
                  break;

                case "alter":
                  noteValue += Number(props.textContent.replaceAll(/\s/g, ""));
                  break;

                default:
                  break;
              }
            }
            pitch = noteValue;
          }
          const duration =
            getNodeProp(note, "duration")?.textContent?.replaceAll(/\s/g, "") ??
            null;
          return {
            isRest: isRest,
            pitch: pitch,
            duration: Number(duration),
            squash: mustSquash,
          };
        });
      });
      return measures;
    });

    song = song.map((part) => {
      const sqPart = [];
      part.forEach((note) => {
        if (note.squash) {
          let { isRest, pitch, duration, squash } = sqPart[sqPart.length - 1];
          sqPart[sqPart.length - 1] = {
            isRest: isRest,
            pitch: pitch,
            duration: duration + note.duration,
            squash: false,
          };
        } else {
          sqPart.push(note);
        }
      });
      return sqPart;
    });

    const createNodeWithText = (n, t) => {
      const elem = document.createElement(n);
      const text = document.createTextNode(t);
      elem.appendChild(text);
      return elem;
    };
    const createNode = (n) => {
      const elem = document.createElement(n);
      return elem;
    };
    const formatTagCode = (t, c) => {
      const spanTitle = createNodeWithText("span", t);
      spanTitle.classList.add("part-tag");
      const spanCode = createNodeWithText("span", c);
      spanCode.classList.add("part-code");
      const paragraph = createNode("p");
      paragraph.appendChild(spanTitle, null);
      paragraph.appendChild(spanCode, null);
      return paragraph;
    };

    const container = document.getElementById("output-container");
    container.innerHTML = "";
    let i = 0;
    for (const part of song) {
      container.insertBefore(createNodeWithText("h2", `Part ${++i}`), null);
      const pitchText = part.map((p) => p.pitch ?? "R");
      const durationText = part.map((p) => p.duration);
      const isRestText = part.map((p) => p.isRest);
      // container.insertBefore(createNodeWithText("p", `pitches: [${pitchText.join(", ")}]`), null);
      container.insertBefore(
        formatTagCode("pitches: ", `[${pitchText.join(", ")}]`),
        null
      );
      container.insertBefore(
        formatTagCode("rhythm: ", `[${durationText.join(", ")}]`),
        null
      );
      container.insertBefore(
        formatTagCode("is rest: ", `[${isRestText.join(", ")}]`),
        null
      );
    }

    // container.innerText = xmlData;
    window.xmlNode = xmlNode;
    window.song = song;
  }

  function loadFile(file) {
    console.log("loadFile");
    return new Promise((resolve, reject) => {
      let fRead = new FileReader();
      fRead.addEventListener(
        "load",
        (evt) => {
          resolve(fRead.result);
        },
        { once: true }
      );
      fRead.addEventListener(
        "error",
        (evt) => {
          console.log("error");
          reject("Fail to read: " + fRead.error);
        },
        { once: true }
      );
      fRead.addEventListener(
        "abort",
        (evt) => {
          console.log("abort");
          reject("Reading was aborted");
        },
        { once: true }
      );

      fRead.readAsText(file);
    });
  }
})();
