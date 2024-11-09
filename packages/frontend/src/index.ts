import "./style.css";
const PLUGIN_PATH = "/font-selector";

const fonts = [
  { name: "Arial", family: "Arial, sans-serif" },
  { name: "Helvetica", family: "Helvetica, sans-serif" },
  { name: "Times New Roman", family: "'Times New Roman', serif" },
  { name: "Courier New", family: "'Courier New', monospace" },
  { name: "Georgia", family: "Georgia, serif" },
  { name: "Palatino", family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
  { name: "Garamond", family: "Garamond, serif" },
  { name: "Bookman", family: "'Bookman Old Style', serif" },
  { name: "Comic Sans MS", family: "'Comic Sans MS', cursive" },
  { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif" },
  { name: "Arial Black", family: "'Arial Black', sans-serif" },
  { name: "Impact", family: "Impact, Charcoal, sans-serif" },
  { name: "Lucida Sans", family: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
  { name: "Tahoma", family: "Tahoma, Geneva, sans-serif" },
  { name: "Verdana", family: "Verdana, Geneva, sans-serif" },
  { name: "Copperplate", family: "Copperplate, 'Copperplate Gothic Light', fantasy" },
  { name: "Brush Script MT", family: "'Brush Script MT', cursive" },
  { name: "Courier", family: "Courier, monospace" },
  { name: "Monaco", family: "Monaco, monospace" },
  { name: "Optima", family: "Optima, sans-serif" }
];

const textEffects = [
  { name: "None", value: "" },
  { name: "Shake", value: "shake" },
  { name: "Random Colors", value: "random-colors" },
  { name: "Blur", value: "blur" },
  { name: "Shadow", value: "shadow" },
  { name: "Gradient", value: "gradient" },
  { name: "3D", value: "three-d" },
];



const createPage = (sdk) => {
  const container = document.createElement("div");
  container.className = "font-selector";

  const header = document.createElement("h1");
  header.textContent = "Font Selector";
  container.appendChild(header);

  const controls = document.createElement("div");
  controls.className = "controls";


  const customFontInput = document.createElement("div");
  customFontInput.className = "custom-font-input";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".woff2,.ttf";
  fileInput.onchange = handleFileUpload;
  customFontInput.appendChild(fileInput);

  controls.appendChild(customFontInput);


  const effectSelector = document.createElement("div");
  effectSelector.className = "effect-selector";

  const effectLabel = document.createElement("label");
  effectLabel.textContent = "Select Text Effect: ";
  effectSelector.appendChild(effectLabel);

  const effectDropdown = document.createElement("select");
  textEffects.forEach(effect => {
    const option = document.createElement("option");
    option.value = effect.value;
    option.textContent = effect.name;
    effectDropdown.appendChild(option);
  });
  effectDropdown.onchange = applyTextEffect;
  effectSelector.appendChild(effectDropdown);

  controls.appendChild(effectSelector);
  container.appendChild(controls);

  const fontList = document.createElement("div");
  fontList.className = "font-list";

  fonts.forEach(font => {
    const fontItem = createFontItem(font);
    fontList.appendChild(fontItem);
  });

  container.appendChild(fontList);

  sdk.navigation.addPage(PLUGIN_PATH, {
    body: container,
  });
};

const createFontItem = (font) => {
  const fontItem = document.createElement("div");
  fontItem.className = "font-item";

  const fontName = document.createElement("h2");
  fontName.textContent = font.name;
  fontItem.appendChild(fontName);

  const fontPreview = document.createElement("p");
  fontPreview.className = "font-preview";
  fontPreview.style.fontFamily = font.family;
  fontPreview.textContent = "I love Caido!";
  fontItem.appendChild(fontPreview);

  const applyButton = document.createElement("button");
  applyButton.className = "apply-button";
  applyButton.textContent = "Apply";
  applyButton.onclick = () => applySelectedFont(font);
  fontItem.appendChild(applyButton);

  return fontItem;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fontName = file.name.split('.')[0];
      const fontFace = new FontFace(fontName, e.target.result);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        const newFont = { name: fontName, family: `'${fontName}', sans-serif` };
        fonts.push(newFont);
        const fontItem = createFontItem(newFont);
        document.querySelector('.font-list').appendChild(fontItem);
      }).catch((error) => {
        console.error('Error loading font:', error);
        alert('Error loading custom font. Please try again.');
      });
    };
    reader.readAsArrayBuffer(file);
  }
};

const applyTextEffect = (event) => {
  const selectedEffect = event.target.value;
  document.querySelectorAll('body *').forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      el.className = el.className.split(' ').filter(c => !textEffects.some(effect => effect.value === c)).join(' ');
      if (selectedEffect) {
        el.classList.add(selectedEffect);
      }
    }
  });
};

const applySelectedFont = (font) => {
  document.body.style.fontFamily = font.family;
  alert(`Font changed to ${font.name}`);
};

export const init = (sdk) => {
  createPage(sdk);
  sdk.sidebar.registerItem("Font Selector", PLUGIN_PATH, {
    icon: "fas fa-font",
  });
};
