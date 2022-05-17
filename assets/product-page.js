$(function() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");

  handleTamanhoSelect();

  handleProductChange();

  handleGenericSelect();

  handleAgregados();

  handleMedidas();

  handleDescriptionMaxHeight(vh);

  handleBackButton();
});

function handleBackButton() {
  var collectionUrl = /\/collections\/[A-z]{1,3}\//;
  $(".nav-back--desktop, .nav-back--mobile").on("click", function() {
    if (collectionUrl.test(document.URL)) {
      window.location = collectionUrl.exec(document.URL)[0];
    } else {
      window.history.back();
    }
  });
}

function handleDescriptionMaxHeight(vh) {
  // $(".product-info--description").css("height", vh * 40 + "px");
  $(".product-technical-info").one("click", function() {
    growDescription();
  });
}

function growDescription() {
  $(".description-text")
    .css("height", "auto")
    .css("overflow", "auto")
    .removeClass("overflow-scroll-gradient");

  var pagePaddingTop = 85;
  var margin = 30;
  var maxHeight =
    $(".product-page-details").innerHeight() -
    pagePaddingTop -
    $(".product-page-details-right").innerHeight() -
    margin;

  $(".product-info--description")
    .css("max-height", maxHeight + "px")
    .css("height", maxHeight + "px");

  $(".product-technical-info, .product-description-separator").hide();
}

function handleAgregados() {
  $("#agregados").slideReveal({
    push: false,
    overlay: true,
    trigger: $(".btn-extra-agregados")
  });
}

function handleMedidas() {
  function isClickingTable(element) {
    var possibleClasses = [
      "tabela-medidas",
      "medidas-header",
      "medidas-offset",
      "medidas-tamanho",
      "medidas-th",
      "medidas-line",
      "medidas-size",
      "medidas-footer"
    ];

    var classList = [].slice.apply(element.classList);
    for (var i = 0; i < classList.length; i++) {
      var currentClass = classList[i];
      if (possibleClasses.indexOf(currentClass) !== -1) {
        return true;
      }
    }
    return false;
  }
  $(".btn-medidas").click(function(event) {
    if (isClickingTable(event.target)) {
      event.stopPropagation();
      return;
    }
    $(".tabela-medidas").toggle();
    event.stopPropagation();
  });
}

function handleTamanhoSelect() {
  function updateLabel() {
    var currentValue = $(".selectric .label").text();
    $(".selectric .label").text("Tamanho " + currentValue);
  }

  $(".select-tamanho")
    .selectric({
      onInit: function() {
        $(".selectric .button").html($("#select-svg").html());
      }
    })
    .on("change", function() {
      updateLabel();
    });

  updateLabel();
}

function handleGenericSelect() {
  $('.select-generic').each(function() {
    var element = this
    var elementContainer = '.' + this.id
    var labelText = $('label[for="' + this.id + '"]').text();

    function updateLabel() {
      var currentValue = $(elementContainer + " select").val();
      $(elementContainer + " .selectric .label").text(labelText + ' ' + currentValue);
    }

    $(element).selectric({
      onInit: function() {
          $(elementContainer + " .selectric .button").html($("#select-svg").html());
        }
      })
      .on("change", function() {
        updateLabel();
      });

    updateLabel();
  })
}

function updateAvailability(variant) {
  var available = variant && variant.available;

  if (available) {
    $(".btn-add-to-cart")
      .removeClass("btn-add-to-cart--disabled")
      .prop("disabled", false);
  } else {
    $(".btn-add-to-cart")
      .addClass("btn-add-to-cart--disabled")
      .prop("disabled", true);
  }
}

function createCell(imageData) {
  return (
    '<div class="carousel-cell"><img alt="' +
    imageData.alt +
    '" class="pseudo-bg-image" src="' +
    imageData.src +
    '" /></div>'
  );
}

function handleProductChange() {
  var $carousel = $(".carousel");
  $('div[data-section-id="product-template"]').on("variantChange", function(
    params
  ) {
    var variant = params.variant;
    updateAvailability(variant);

    if (!variant) {
      return;
    }

    $(".carousel-cell", $carousel).each(function() {
      $carousel.flickity("remove", $(this));
    });

    var selectedImages = [];
    var cellElements = "";
    for (var i = 0; i < productImages.length; i++) {
      var currentImage = productImages[i];
      var productName = variant.name.split(" - ")[0];
      var alt1 = [productName, variant.option1, variant.option2].join(" ");
      var alt2 = [productName, variant.option2, variant.option1].join(" ");
      if (
        $.trim(currentImage.alt) === alt1 ||
        $.trim(currentImage.alt) === alt2 ||
        $.trim(currentImage.alt) == productName
      ) {
        selectedImages.push(currentImage);
        cellElements += createCell(currentImage);
      }
    }

    var $cellElements = $(cellElements);
    $carousel.flickity("append", $cellElements);

    // Muda slide selecionado no carousel
    $carousel.flickity("select", 0);
    $carousel.flickity("stopPlayer");

    // Muda nome do produto
    var newName = (variant.option2 || '') + " " + variant.option1;
    $(".product-info .product-name span").text(newName);
  });
}

$(document).ready(function() {
  $(".product-color-option input").change(function() {
    $(this).attr("checked", "checked");
    $(".product-color-option--selected").removeClass(
      "product-color-option--selected"
    );
    $(this)
      .parent(".product-color-option")
      .addClass("product-color-option--selected");
  });
});

$(document).ready(function() {
  var $shareBtn = $(".share-btn");
  if (navigator.share) {
    $shareBtn.removeClass("a2a_dd");
    $shareBtn.on("click", shareFn);
  }

  function shareFn() {
    var url = document.location.href;
    var canonicalElement = document.querySelector("link[rel=canonical]");
    if (canonicalElement !== null) {
      url = canonicalElement.href;
    }
    var description = undefined;
    var descriptionElement = document.querySelector("meta[name=description]");
    if (descriptionElement !== null) {
      description = descriptionElement.content;
    }
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: description,
        url: url
      });
    }
  }
});
