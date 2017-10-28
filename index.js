const shell = require('shelljs');
const assert = require('assert');
const escape = require('schellescape');

const pdfjamOptions = ['nup', 'scale', 'trim', 'suffix', 'outfile', 'papersize'];

function pdfnup(input, _rows, _cols, _options) {
    assert(arguments.length >= 3, "Insufficient arguments for pdfjam.nup, expected at least 3, was given " + arguments.length);

    const rows = +_rows;
    const cols = +_cols;

    assert(Number.isSafeInteger(rows) && rows > 0, "The number of rows needs to be a number");
    assert(Number.isSafeInteger(cols) && cols > 0, "The number of columns needs to be a number");

    const options = Object.assign({}, _options, {nup: `${rows}x${cols}`});
    if (! ("suffix" in options) && ! ("outfile" in options)) {
        options.suffix = "nup";
    }

    return pdfjam(input, options);
}

async function pdfjam(_input, _options) {
    /* Properly quote inputs */
    let input = _input;
    if (!Array.isArray(_input)) {
        input = [_input];
    }

    const options = Object.assign({}, _options);

    const args = [];
    if (options.orientation === "landscape") {
        args.push("--landscape");
    }

    if (options.batch) {
        args.push("--batch");
    }

    /* So they don't get caught in the assert below */
    delete options.orientation;
    delete options.batch;

    for (const opt of Object.keys(options)) {
        assert(pdfjamOptions.indexOf(opt) !== -1, `Unknown pdfjam option: ${opt}`);

        args = args.concat([`--${opt}`, options[opt]]);
    }

    args = args.concat(input);

    assert(shell.which('pdfjam'), "No local pdfjam installation detected. Install texlive-extra-utils on your system.");

    shell.exec(`pdfjam ${escape(args)}`);
}

modules.exports = (function() {
    this.nup = pdfnup;

    return pdfjam;
})();