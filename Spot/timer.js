class Timer {

    constructor() {

    }

    async execute(minutes) {
        return new Promise((resolve) => {
            const milliseconds = minutes * 60 * 1000;

            setTimeout(function () {
                resolve("Running"); // Resolve the Promise when the timer is up
            }, milliseconds);
        });
    }
}
module.exports = Timer;