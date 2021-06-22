let openCvLoaded = false;

// eslint-disable-next-line no-undef
cv.onRuntimeInitialized = () => {
  openCvLoaded = true;
};
