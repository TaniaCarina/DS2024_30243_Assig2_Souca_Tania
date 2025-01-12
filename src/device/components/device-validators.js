function Validate(value, constraints) {

    const checkMinLength = (input, minLength) => input.length >= minLength;

    const checkRequired = (input) => input.trim() !== '';

    const checkEmailFormat = (input) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(input);
    };

    let validationResult = true;

    for (const constraint in constraints) {
        if (!validationResult) break;

        switch (constraint) {
            case 'minLength':
                validationResult = validationResult && checkMinLength(value, constraints[constraint]);
                break;

            case 'isRequired':
                validationResult = validationResult && checkRequired(value);
                break;

            case 'isEmail':
                validationResult = validationResult && checkEmailFormat(value);
                break;

            default:
                validationResult = true;
        }
    }

    return validationResult;
}

export default Validate;
