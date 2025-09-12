export function validateSignUp(name, username, email, password, setNameError, setUsernameError, setEmailError, setPasswordError) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        setNameError("please enter your name");
        isValid = false;
    } else {
        setNameError("");
    }

    if (!username) {
        setUsernameError("please enter your username");
        isValid = false;
    } else {
        setUsernameError("");
    }

    if (!email) {
        setEmailError("please enter your email");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        setEmailError("email must be a valid email");
        isValid = false;
    } else {
        setEmailError("");
    }

    if (password.length < 6) {
        setPasswordError("password must be at least 6 characters");
        isValid = false;
    } else {
        setPasswordError("");
    }

    return isValid;
}

export function validateLogIn(email, password, setEmailError, setPasswordError) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        setEmailError("please enter your email");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        setEmailError("email must be a valid email");
        isValid = false;
    } else {
        setEmailError("");
    }

    if (password.length < 6) {
        setPasswordError("password must be at least 6 characters");
        isValid = false;
    } else {
        setPasswordError("");
    }

    return isValid;
}