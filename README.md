# node-pdfjam

Npm package for using pdfjam utilities.

This project for now mainly implements the 'nup' capabilities. It can merge multiple pdfs into one,
and also merge pages of pdfs so 4 pages would appear in one for example. More info [here](https://linux.die.net/man/1/pdfnup)

Here is a demonstration

```js
/* We are using await / async syntax here from node 8+, you can also use Promise syntax instead */
const pdfjam = require('pdfjam');

async function main() {
    /* Standard conversion of pdf with pages in a 2x2 layout */
    await pdfjam.nup('file.pdf', 2, 2,  {
        /* Suffix the new pdf file will have, `${originalName}-{suffix}.pdf`, by default is 'nup' */
        suffix: '2x2'
    });

    /* Just merge files, no page layout. Suffix is "pdfjam" in this case */
    await pdfjam(['file1.pdf', 'file2.pdf', 'file3.pdf'],  {
        // nup : "2x2" <- nup can be used through options
        // default suffix is "pdfjam" here
        // In fact the options argument is never mandatory
    });

    /* Conversion of pdf with pages in a 1x2 layout */
    await pdfjam.nup('file.pdf', 1, 2,  {
        /* Destination file, overrides suffix */
        outfile: 'file-converted.pdf'
    });

    /* Output in landscape mode, with paper size specified (by default A4) */
    await pdfjam.nup('file.pdf', 2, 1,  {
        orientation: 'landscape',
        papersize: '{1920px,1080px}' /* Can also use cm as unit */
        scale: 0.9 /* Reduce input page sizes a bit */
    });

    /* Merge multiple files in one, with the output a layout of 2x2 */
    await pdfjam.nup(['file1.pdf', 'file2.pdf', 'file3.pdf'], 2, 2,  {
        scale: 0.9 /* Reduce input page sizes a bit */
    });

    /* Merge multiple slides and adjust margins */
    await pdfjam(['slide1.pdf', 'slide2.pdf', 'slide3.pdf', 'slide4.pdf', 'slide5.pdf'], {
        outfile: "slides.pdf",
        trim: "-6cm -1cm 13cm 8cm",
        scale: 0.4
    });
}

main().then(() => {
    console.log("All done!");
})
```

## Requirements

Pdfjam is needed. On debian systems, you can get it like that:

```
sudo apt install texlive-extra-utils
```

Note that this installs 600MB of programs if you don't already have a LaTeX infrastructure.

Node version 6+ is expected. If you want to update your node version, you can do:

```bash
sudo npm install -g n
sudo n stable
```

## Documentation

All functions return promises. The output directory of pdfjam is the working directory of your program (`process.cwd()`),
but you can specify an absolute path in the `outfile` option.

**pdfjam**(input: *string | string[]*, options: *object*)

Invokes `pdfjam` with the input given. If an array of strings is given as input, then the input files will be merged
in the output, unless the `batch` options is provided, in which case there will be as many output files as input files.

Here are the valid values for `options`:

- **suffix** *{string = 'pdfjam'}*: What to append to the input filename to get the output filename. Overriden by the `outfile` option. Default
  value is `"pdfjam"`. The output file name will look like `basename-suffix.pdf`.
- **outfile** *{string}*: Output pdf file, overrides `suffix` if supplied.
- **orientation** *{'portrait'|'landscape'}* : Orientation of the output.
- **batch** *{boolean = false}*: If set to true, will process each input file individually and produce an output file for each.
- **scale** *{number = 1.0}*: Can resize the pages of the input in the output.
- **papersize** *{string = "{21cm,29.7cm}"}*: Size of the pages in the output. Unit can be cm or px.
- **trim** *{string = "0cm 0cm 0cm 0cm"}*: Remove margins from the input pages. Can also add margins by using negative numbers.
- **nup** *{string = "1x1"}*: Page layout in the output pdf.

**pdfjam.nup** (input: *string | string[]*, rows: *number*, cols: *number*, options: *object*)

Helper for page layout. Calls `pdfjam` with the `nup` option, as well as the provided `options`, and if no suffix or outfile is provided, will set the suffix to `"nup"`.


## Contributing

I very welcome contributions or even taking over of the project. This project was made in order to fill one
of my particular needs, the use of `pdfnup`, so I welcome any contribution adding more of pdjam's features.

I also welcome any contribution in the form of tests, travis integration, using a build script to make the 
project compatible with older node versions and so on.
