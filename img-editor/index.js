const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlinder = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  saveImgBtn = document.querySelector(".save-img"),
  chooseImgBtn = document.querySelector(".choose-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  blur = 0,
  dropShadow = "0px 0px 0px #000",
  contrast = 100,
  opacity = 100,
  invert = 0,
  sepia = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px) contrast(${contrast}%) opacity(${opacity}%) sepia(${sepia}%)`;
  previewImg.style.boxShadow = dropShadow;
};

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlinder.max = "200";
      filterSlinder.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlinder.max = "200";
      filterSlinder.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlinder.max = "100";
      filterSlinder.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else if (option.id === "grayscale") {
      filterSlinder.max = "100";
      filterSlinder.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    } else if (option.id === "blur") {
      filterSlinder.max = "50";
      filterSlinder.value = blur;
      filterValue.innerText = `${blur}px`;
    } else if (option.id === "drop-shadow") {
      filterSlinder.max = "50";
      filterSlinder.value = dropShadow;
      filterValue.innerText = dropShadow;
    } else if (option.id === "contrast") {
      filterSlinder.max = "200";
      filterSlinder.value = contrast;
      filterValue.innerText = `${contrast}%`;
    } else if (option.id === "opacity") {
      filterSlinder.max = "100";
      filterSlinder.value = opacity;
      filterValue.innerText = `${opacity}%`;
    } else if (option.id === "invert") {
      filterSlinder.max = "100";
      filterSlinder.value = invert;
      filterValue.innerText = `${invert}%`;
    } else if (option.id === "sepia") {
      filterSlinder.max = "100";
      filterSlinder.value = sepia;
      filterValue.innerText = `${sepia}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = filterSlinder.value;

  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlinder.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlinder.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlinder.value;
  } else if (selectedFilter.id === "grayscale") {
    grayscale = filterSlinder.value;
  } else if (selectedFilter.id === "blur") {
    blur = filterSlinder.value;
  } else if (selectedFilter.id === "drop-shadow") {
    dropShadow = filterSlinder.value;
  } else if (selectedFilter.id === "contrast") {
    contrast = filterSlinder.value;
  } else if (selectedFilter.id === "opacity") {
    opacity = filterSlinder.value;
  } else if (selectedFilter.id === "invert") {
    invert = filterSlinder.value;
  } else if (selectedFilter.id === "sepia") {
    sepia = filterSlinder.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  blur = 0;
  dropShadow = "0px 0px 0px #000";
  contrast = 100;
  opacity = 100;
  invert = 0;
  sepia = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px) contrast(${contrast}%) opacity(${opacity}%) sepia(${sepia}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

fileInput.addEventListener("change", loadImage);
filterSlinder.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
