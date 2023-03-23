# simple-slideshow
A simple slideshow control in plain Javascript/CSS

## Overview
The Simple Slideshow control is a basic HTML control that can be inserted into a webpage to display a series of slides that can be either automatically or manually advanced.

## How to Setup
### Step 1:  Copy source files to your website
Copy the contents of the [slideshow](slideshow/) folder to your website.  This only has to be done once.

### Step 2:  Create the slideshow data file
You will need to create a data file to describe the contents of the slideshow.  This file is in `json` format and should have the following structure:

```
{
    "content": [
        {
            "header_image": "images/image1.jpg",
            "description": "Image 1"
        },
        {
            "header_image": "images/image2.jpg",
            "description": "Image 2"
        },
        {
            "header_image": "images/image3.jpg",
            "description": "Image 3"
        }
    ]
}
```

The "description" value is optional if no description is needed.  The description can contain HTML elements.

It is suggested that the "header_image" images in a slideshow have similar height/width ratios to each other.

### Step 3:  Add links to the javascript and CSS file to your website page
On each page where a slideshow will be created, add the following to the page `<head>` section:

```
    <link rel="stylesheet" href="/slideshow/slideshow.css" />
    <script type="text/javascript" src="/slideshow/slideshow.js"></script>
```

1. Add and configure the container control
1. Add an `onload` event to your webpage to initialize the slideshow


### Step 4:  Add a container control for the slideshow
Add a `<div>` control with a unique id where the slideshow should be rendered on your page.  At minimum, a unique id needs to be specified.

```
<div id="my_slideshow"></div>
```

A page can contain any number of slideshows simultaneously.

There are several optional configuration attributes that can be added to the div to customize the slideshow:

| Attribute              | Type   | Description                                                                                            | Default Value |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------ | ------------- |
| data-auto-advance      | number | If specified, the number of milliseconds before the slideshow automatically advances to the next slide |               |
| data-caption-template  | text   | Template for caption text.  More information below.                                                    |               |
| data-image-height      | text   | Height of the slideshow image.  Should be formatted as `[x]px` or `[x]%`.                              | `250px`       |
| data-image-width       | text   | Width of the slideshow image.  Should be formatted as `[x]px` or `[x]%`.                               | `400px`       |
| data-manual-controls   | bool   | If "false", hides user controls                                                                        | `true`        |
| data-next-button-label | text   | Text for "next" button user control                                                                    | `>>`          |
| data-preload-images    | bool   | If "true", preloads images for the slideshow                                                           | `true`        |
| data-prev-button-label | text   | Text for "previous" button user control                                                                | `<<`          |

## Step 5:  Initialize the slideshow
Finally, add the following `<script>` to your page:
```
    <script>
        window.onload = function () {
            initSlideShow("./slideShow.json", document.getElementById("my_slideshow"));
        }
    </script>
```

The parameters for `initSlideShow` are as follows:
1. URL to the `json` file created to describe the slideshow contents
2. The container control where the slideshow should be rendered

Note that if multiple slideshows are to be displayed on the page, each slideshow must call `initSlideShow`.
