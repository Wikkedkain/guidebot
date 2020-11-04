class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.code = 500;
    }

    getCode() {
        return this.code;
    }
}
class BadRequest extends GeneralError {
    constructor(message) {
        super();
        this.message = message;
        this.code = 400;
    }
}
class NotFound extends GeneralError {
    constructor(message) {
        super();
        this.message = message;
        this.code = 404;
    }
}

module.exports = {
    GeneralError,
    BadRequest,
    NotFound
}