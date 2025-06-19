export function autoTyper(element, text, speed = 100) {
  let index = 0;
  let isDeleting = false;

  function type() {
    const currentText = isDeleting
      ? text.substring(0, index - 1)
      : text.substring(0, index + 1);

    element.innerHTML = `<span class="wrap">${currentText}</span>`;

    if (!isDeleting && index === text.length) {
      isDeleting = true;
      setTimeout(type, 2000); // Pause before deleting
    } else if (isDeleting && index === 0) {
      isDeleting = false;
      setTimeout(type, 500); // Pause before re-typing
    } else {
      index += isDeleting ? -1 : 1;
      setTimeout(type, speed);
    }
  }

  type();
}
