export function autoTyper(element, texts, speed = 100) {
  // Accept either a single string or an array of strings
  const words = Array.isArray(texts) ? texts : [texts];
  if (!element || words.length === 0) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = words[wordIndex];
    const visible = current.substring(0, charIndex);
    element.innerHTML = `<span class="wrap">${visible}</span>`;

    if (!isDeleting) {
      // Typing forward
      if (charIndex < current.length) {
        charIndex++;
        setTimeout(tick, speed);
      } else {
        // Pause at end before deleting
        isDeleting = true;
        setTimeout(tick, 2000);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        charIndex--;
        setTimeout(tick, speed);
      } else {
        // Move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, 500);
      }
    }
  }

  // Start
  tick();
}
