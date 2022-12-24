const elem = document.getElementById("username");
elem.addEventListener(
    "keydown",
    (e) => {
        if (!allowedCharacter(e.key.toLowerCase())) {
            e.preventDefault();
        }
    },
    true

);

elem.addEventListener(
    "blur",
    (e) => {
        if (!allowedCharacter(e.key.toLowerCase())) {
            e.preventDefault();
        }
    },
    true

);

/**
 *
 * @param{string} key Character that needs to be checked
 * @returns{bool} True if character is allowed
 */
function allowedCharacter(key) {
    if (key.length > 1) {
        if (key === "enter") {
            return false;
        }
        return true;
    }

    // Check for specific characters
    const ascii = key.charCodeAt(0);
    if (ascii >= 97 && ascii <= 122) {
        return true;
    } else if (ascii >= 48 && ascii <= 57) {
        return true;
    } else if (ascii === 45 || ascii === 95) {
        return true;
    }
    return false;
}



