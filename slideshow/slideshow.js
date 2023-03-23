let global_ss_data = [];
/*
  global_ss_data structure: 

  global_ss_data = [
    { 
      content: [
        {
            header_image: "url",    # From JSON
            description:  "text",   # From JSON
        }
        ...
      ],    
      current_index:    number,     # Calculated
      caption_template: "text",     # From container
      manual_controls:  "bool",     # From container
      next_button_label: "text",    # From container
      prev_button_label: "text",    # From container
      auto_advance:     number,     # From container
      image_height:     number,     # From container
      image_width:      number,     # From container
    }
    ...
  ];
*/

function initSlideShow(jsonPath, container) {
    let slideShowIndex = global_ss_data.length;

    global_ss_data[slideShowIndex] = {}
    global_ss_data[slideShowIndex].current_index = 0;
    global_ss_data[slideShowIndex].caption_template = container.getAttribute("data-caption-template") || "";
    global_ss_data[slideShowIndex].manual_controls = (container.getAttribute("data-manual-controls") || "true") != "false";
    global_ss_data[slideShowIndex].preload_images = (container.getAttribute("data-preload-images") || "true") != "false";
    global_ss_data[slideShowIndex].next_button_label = container.getAttribute("data-next-button-label") || ">>";
    global_ss_data[slideShowIndex].prev_button_label = container.getAttribute("data-prev-button-label") || "<<";
    global_ss_data[slideShowIndex].auto_advance = container.getAttribute("data-auto-advance") || "undefined";
    global_ss_data[slideShowIndex].image_height = container.getAttribute("data-image-height") || "250px";
    global_ss_data[slideShowIndex].image_width = container.getAttribute("data-image-width") || "400px";

    fetch(jsonPath)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Unable to load slideshow json from " + jsonPath);
        })
        .then(data => {
            global_ss_data[slideShowIndex].content = data.content;
            container.innerHTML = renderUI(container, slideShowIndex, global_ss_data[slideShowIndex]);
            if (global_ss_data[slideShowIndex].preload_images) {
                preloadImages(data.content, slideShowIndex);
            }

            slideTo(0, slideShowIndex);
            if (global_ss_data[slideShowIndex].auto_advance !== null && !isNaN(global_ss_data[slideShowIndex].auto_advance)) {
                let auto_advance = Math.max(global_ss_data[slideShowIndex].auto_advance, 100);
                setInterval(function () { slideNext(slideShowIndex) }, auto_advance);
            }
        })
        .catch((error) => {
            container.innerHTML = error;
        });
}

function preloadImages(slideShowData, slideShowIndex) {
    var cache = document.getElementById("ss_img_cache_" + slideShowIndex);
    for (var i = 0; i < slideShowData.length; i++) {
        var img = new Image();
        img.src = slideShowData[i].header_image;
        img.style = "position:absolute";
        cache.appendChild(img);
    }
}

function renderUI(container, slideShowIndex, slideShowData) {
    let uiControls =
        '<div class="card" style="width:' + slideShowData.image_width + ';">' +
        '  <div class="header" style="height:' + slideShowData.image_height + ';" id="ss_header_' + slideShowIndex + '">';

    if (slideShowData.manual_controls) {
        uiControls +=
            '    <div class="nav_button prev_button" onclick="javascript:slidePrev(' + slideShowIndex + ')">' +
            '      <p class="nav_button_label">' + slideShowData.prev_button_label + '</p>' +
            '    </div>' +
            '    <div class="nav_button next_button" onclick="javascript:slideNext(' + slideShowIndex + ')">' +
            '      <p class="nav_button_label">' + slideShowData.next_button_label + '</p>' +
            '    </div>';
    }

    uiControls +=
        '  </div>' +
        '  <div class="caption" id="ss_caption_' + slideShowIndex + '"></div>' +
        '  <div class="description" id="ss_description_' + slideShowIndex + '"></div>' +
        '</div>';

    if (slideShowData.preload_images) {
        uiControls += '<div id="ss_img_cache_' + slideShowIndex + '" style="position:absolute;z-index:-1000;opacity:0;"></div>';
    }

    return uiControls;
}

function slideNext(slideShowIndex) {
    let currentIndex = global_ss_data[slideShowIndex].current_index;
    slideTo(currentIndex + 1, slideShowIndex);
}

function slidePrev(slideShowIndex) {
    let currentIndex = global_ss_data[slideShowIndex].current_index;
    slideTo(currentIndex - 1, slideShowIndex);
}

function slideTo(proposedIndex, slideShowIndex) {
    // Get and validate new index from proposed index;
    let newIndex = proposedIndex;
    if (newIndex >= global_ss_data[slideShowIndex].content.length) { newIndex = 0; }
    if (newIndex < 0) { newIndex = global_ss_data[slideShowIndex].content.length - 1; }

    // Cache new index in global data
    global_ss_data[slideShowIndex].current_index = newIndex;

    // Update slide with content data from new index
    let content = global_ss_data[slideShowIndex].content[newIndex];
    document.getElementById('ss_header_' + slideShowIndex).style.backgroundImage = "url('" + content.header_image + "')";
    document.getElementById('ss_caption_' + slideShowIndex).innerHTML = getCaption(global_ss_data[slideShowIndex]);
    document.getElementById('ss_description_' + slideShowIndex).innerHTML = content.description || "";
}

function getCaption(slideshowData) {
    return slideshowData.caption_template
        .replace("[index]", slideshowData.current_index + 1)
        .replace("[length]", slideshowData.content.length)
}
