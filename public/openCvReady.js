window.openCvLoaded = false;

// eslint-disable-next-line no-undef
cv.onRuntimeInitialized = () => {
  window.openCvLoaded = true;
};
